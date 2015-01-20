# create_table :order_line_items do |t|
#   t.integer  	  :order_txn_id
#   t.integer  	  :order_line_item_type_id
#   t.integer     :product_offer_id
#   t.string      :product_offer_description
#   t.integer     :product_instance_id,
#   t.string      :product_instance_description
#   t.integer     :product_type_id
#   t.string      :product_type_description
#   t.decimal  	  :sold_price, :precision => 8, :scale => 2
#   t.integer	    :sold_price_uom
#   t.integer  	  :sold_amount
#   t.integer     :sold_amount_uom
#   t.integer     :quantity
#   t.integer     :unit_of_measurement_id
#   t.timestamps
# end
#
# add_index :order_line_items, :order_txn_id
# add_index :order_line_items, :order_line_item_type_id
# add_index :order_line_items, :product_instance_id
# add_index :order_line_items, :product_type_id
# add_index :order_line_items, :product_offer_id

class OrderLineItem < ActiveRecord::Base
  attr_protected :created_at, :updated_at

  belongs_to :order_txn, :class_name => 'OrderTxn'
  belongs_to :order_line_item_type

  has_many :charge_lines, :as => :charged_item

  belongs_to :product_instance
  belongs_to :product_type
  belongs_to :product_offer

  has_many :order_line_item_pty_roles, :dependent => :destroy
  has_many :role_types, :through => :order_line_item_pty_roles

  ## Allow for polymorphic subtypes of this class
  belongs_to :order_line_record, :polymorphic => true

  # get the total charges for a order_line_item.
  # The total will be returned as Money.
  # There may be multiple Monies assocated with an order, such as points and
  # dollars. To handle this, the method should return an array of Monies
  # if a currency is passed in return the amount for only that currency
  def get_total_charges(currency=nil)
    if currency and currency.is_a?(String)
      currency = Currency.send(currency)
    end

    # get all of the charge lines associated with the order_line
    total_hash = Hash.new
    charge_lines.each do |charge|
      cur_money = charge.money
      cur_total = total_hash[cur_money.currency.internal_identifier]
      if (cur_total.nil?)
        cur_total = cur_money.dup
      else
        cur_total.amount = 0 if cur_total.amount.nil?
        cur_total.amount += cur_money.amount if !cur_money.amount.nil?
      end
      total_hash[cur_money.currency.internal_identifier] = cur_total
    end

    if currency
      money = total_hash[currency.internal_identifier]
      money.nil? ? nil : money.amount
    else
      total_hash
    end
  end

  # Alias for to_s
  def to_label
    to_s
  end

  # description of line_item_record
  def to_s
    line_item_record.description
  end

  private

  # determine the record this OrderLineItem pertains to
  # can be a ProductOffer, ProductInstance or ProductType
  def line_item_record
    if product_offer
      product_offer
    else
      if product_instance
        product_instance
      else
        product_type
      end
    end
  end

end
