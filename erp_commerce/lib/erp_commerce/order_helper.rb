module ErpCommerce
  class OrderHelper
    attr_accessor :widget
    delegate :params, :session, :request, :logger, :current_user, :to => :widget

    def initialize(widget)
      self.widget = widget
    end

    def get_order(create=nil)
      order = nil

      ActiveRecord::Base.transaction do
        if session['order_txn_id'].nil?
          order = create_order if create
        else
          order = OrderTxn.where('id = ?', session['order_txn_id']).first
          order = create_order if order.nil?
        end
      end

      order
    end

    # add a product type to cart
    def add_to_cart(offer_data)
      order = get_order(true)

      ActiveRecord::Base.transaction do

        # check if there is a simple_product_offer_id present, if so
        # then look up the simple product offer, if not get the product_type
        if offer_data[:simple_product_offer_id]
          simple_product_offer = SimpleProductOffer.find(offer_data[:simple_product_offer_id])

          order_line_item = order.add_line_item(simple_product_offer)

          # get the pricing plan for the product type
          pricing_plan = simple_product_offer.get_current_simple_plan
        else
          product_type = ProductType.find(offer_data[:product_type_id])

          order_line_item = order.add_line_item(product_type)

          # get the pricing plan for the product type
          pricing_plan = product_type.get_current_simple_plan
        end

        # check for charge line and if not present create it
        if order_line_item.charge_lines.empty?
          money = Money.create(
              :description => pricing_plan.description,
              :amount => 0,
              :currency => pricing_plan.currency)

          charge_line = ChargeLine.create(
              :charged_item => order_line_item,
              :money => money,
              :description => pricing_plan.description)

          order_line_item.charge_lines << charge_line
        else
          charge_line = order_line_item.charge_lines.first
        end

        # increment charge line by price of product
        charge_line.money.amount += pricing_plan.money_amount
        charge_line.money.save

        order.current_status = 'items_added'
        order.save
      end

      order
    end

    # set billing information
    def set_demographic_info(params)
      order = get_order

      ActiveRecord::Base.transaction do
        # check if we have a current user, if we do then update the users party info, if not create
        # a party for this transaction
        if current_user
          party = self.current_user.party
        else
          individual = Individual.new
          individual.current_first_name = params[:bill_to_first_name].strip
          individual.current_last_name = params[:bill_to_last_name].strip
          individual.save
          party = individual.party
        end

        # check if the party has the customer PartyRole if not add it
        unless party.has_role_type?('customer')
          party.add_role_type('customer')
        end

        # if biz txn party roles have not been setup set them up
        if order.root_txn.biz_txn_party_roles.nil? || order.root_txn.biz_txn_party_roles.empty?
          setup_biz_txn_party_roles(order, party)
        end

        # set billing information on party
        # get geo codes
        geo_country = GeoCountry.find_by_iso_code_2(params[:bill_to_country])
        geo_zone = GeoZone.find_by_zone_code(params[:bill_to_state])
        party.update_or_add_contact_with_purpose(PostalAddress, ContactPurpose.billing,
                                                 {
                                                     :address_line_1 => params[:bill_to_address_line_1],
                                                     :address_line_2 => params[:bill_to_address_line_2],
                                                     :city => params[:bill_to_city],
                                                     :state => geo_zone.zone_name,
                                                     :zip => params[:bill_to_postal_code],
                                                     :country => geo_country.name
                                                 })
        billing_postal_address = party.find_contact_mechanism_with_purpose(PostalAddress, ContactPurpose.billing)
        billing_postal_address.geo_country = geo_country
        billing_postal_address.geo_zone = geo_zone
        billing_postal_address.save

        # set shipping information on party
        # same as billing us billing info
        if params[:ship_to_billing] == 'on'
          # get geo codes
          geo_country = GeoCountry.find_by_iso_code_2(params[:bill_to_country])
          geo_zone = GeoZone.find_by_zone_code(params[:bill_to_state])
          party.update_or_add_contact_with_purpose(PostalAddress, ContactPurpose.shipping,
                                                   {
                                                       :address_line_1 => params[:bill_to_address_line_1],
                                                       :address_line_2 => params[:bill_to_address_line_2],
                                                       :city => params[:bill_to_city],
                                                       :state => geo_zone.zone_name,
                                                       :zip => params[:bill_to_postal_code],
                                                       :country => geo_country.name
                                                   })
          shipping_postal_address = party.find_contact_mechanism_with_purpose(PostalAddress, ContactPurpose.shipping)
          shipping_postal_address.geo_country = geo_country
          shipping_postal_address.geo_zone = geo_zone
          shipping_postal_address.save
        else
          # get geo codes
          geo_country = GeoCountry.find_by_iso_code_2(params[:ship_to_country])
          geo_zone = GeoZone.find_by_zone_code(params[:ship_to_state])
          party.update_or_add_contact_with_purpose(PostalAddress, ContactPurpose.shipping,
                                                   {
                                                       :address_line_1 => params[:ship_to_address_line_1],
                                                       :address_line_2 => params[:ship_to_address_line_2],
                                                       :city => params[:ship_to_city],
                                                       :state => geo_zone.zone_name,
                                                       :zip => params[:ship_to_postal_code],
                                                       :country => geo_country.name
                                                   })
          shipping_postal_address = party.find_contact_mechanism_with_purpose(PostalAddress, ContactPurpose.shipping)
          shipping_postal_address.geo_country = geo_country
          shipping_postal_address.geo_zone = geo_zone
          shipping_postal_address.save
        end

        # set phone and email
        party.update_or_add_contact_with_purpose(PhoneNumber, ContactPurpose.billing, {:phone_number => params[:bill_to_phone]})
        party.update_or_add_contact_with_purpose(EmailAddress, ContactPurpose.billing, {:email_address => params[:bill_to_email]})

        # set billing and shipping info on order
        order.set_shipping_info(party)
        order.set_billing_info(party)

        # update status
        order.current_status = 'demographics_gathered'
        order.save
      end

      order
    end

    # complete the order
    def complete_order(params, charge_credit_card=true)
      success = true
      message = nil
      result = nil
      order = get_order

      ActiveRecord::Base.transaction do
        if charge_credit_card
          # make credit financial txns and payment txns
          # create financial txn for order

          financial_txn = create_financial_txn(order)

          credit_card = CreditCard.new(
              :first_name_on_card => params[:first_name],
              :last_name_on_card => params[:last_name],
              :expiration_month => params[:exp_month],
              :expiration_year => params[:exp_year]
          )

          credit_card.card_number = params[:card_number]

          result = if params[:active_merchant_gateway_wrapper]
                     CreditCardAccount.new.purchase(financial_txn, params[:cvvs], "ErpCommerce::ActiveMerchantWrappers::#{params[:active_merchant_gateway_wrapper]}".constantize, {private_key: params[:private_key], public_key: params[:public_key]}, credit_card)
                   else
                     CreditCardAccount.new.purchase(financial_txn, params[:cvvs], ErpCommerce::Config.active_merchant_gateway_wrapper, {}, credit_card)
                   end


          if result[:payment] && result[:payment].success
            order.apply_payment_to_all_charge_lines(financial_txn)
          else
            success = false
            message = result[:message]
            order.current_status = 'payment_failed'
          end
        end

        if success
          order.current_status = 'paid'
          order.current_status = 'ready_to_ship'
          # update inventory counts
          # should be moved to model somewhere
          ########TODO NEED TO IMPLEMENT
          # order.order_line_items.each do |oli|
          #   inventory_entry = oli.product_type.inventory_entries.first
          #   inventory_entry.number_available -= 1
          #   inventory_entry.number_sold += 1
          #   inventory_entry.save
          # end
          #clear order from session
          clear_order
        end

        order.save
      end

      return success, message, order, result[:payment]
    end

    # remove line item
    def remove_from_cart(order_line_item_id)
      order = get_order

      ActiveRecord::Base.transaction do
        order.line_items.find(order_line_item_id).destroy
      end

      order
    end

    private

    def clear_order
      session['order_txn_id'] = nil
    end

    def create_order
      order = OrderTxn.create
      order.current_status = 'initialized'
      order.order_number = (Time.now.to_i / (rand(100)+2)).round
      order.save
      session['order_txn_id'] = order.id
      setup_biz_txn_party_roles(order, current_user.party) if current_user
      order
    end

    # sets up payor party role
    def setup_biz_txn_party_roles(order, party)
      biz_txn_role_type = BizTxnPartyRoleType.find_or_create('customer',
                                                             'Customer',
                                                             BizTxnPartyRoleType.iid('order_roles'))
      biz_txn_event = order.root_txn
      tpr = BizTxnPartyRole.new
      tpr.biz_txn_event = biz_txn_event
      tpr.party = party
      tpr.biz_txn_party_role_type = biz_txn_role_type
      tpr.save
    end

    # create financial_txn
    def create_financial_txn(order)
      money = Money.create(:description => 'Order Payment', :amount => order.get_total_charges(Currency.usd), :currency => Currency.usd)

      financial_txn = FinancialTxn.create(:money => money)
      financial_txn.description = 'Order Payment'
      financial_txn.txn_type = BizTxnType.iid('payment_txn')
      financial_txn.save

      financial_txn
    end

  end # ErpCommerce
end # OrderHelper
