module ErpCommerce
  class BasicOfferEngine

    def initialize(ctx={})
      @context = ctx
    end


    def filter(context=@context)
      @context = context

      # get connection
      connection = ActiveRecord::Base.connection

      # define the tables and aliased tables
      product_types = ProductType.arel_table

      product_offers = ProductOffer.arel_table
      simple_product_offers = SimpleProductOffer.arel_table

      pricing_plans = PricingPlan.arel_table
      product_type_pricing_plans = pricing_plans.alias('product_type_pricing_plans')
      simple_product_offer_pricing_plans = pricing_plans.alias('simple_product_offer_pricing_plans')

      descriptive_assets = DescriptiveAsset.arel_table
      list_descriptive_assets = descriptive_assets.alias('list_descriptive_assets')
      short_descriptive_assets = descriptive_assets.alias('short_descriptive_assets')
      long_descriptive_assets = descriptive_assets.alias('long_descriptive_assets')


      # select the fields to be mapped into result hashes
      statement = product_types.project(product_types[:id].as("product_type_id"),
                                        product_types[:description].as("title"),
                                        product_offers[:valid_from],
                                        list_descriptive_assets[:description].as("list_description"),
                                        short_descriptive_assets[:description].as("short_description"),
                                        long_descriptive_assets[:description].as("long_description"),
                                        product_type_pricing_plans[:money_amount].as("price"),
                                        simple_product_offer_pricing_plans[:money_amount].as("sale_price"),
                                        simple_product_offers[:description].as('offer_list_description'),
                                        simple_product_offers[:id].as('simple_product_offer_id')
      )

      count_statement = product_types.project(product_types[:id].count)

      statement = apply_filters(statement)
      count_statement = apply_filters(count_statement)

      # get total count of results
      length = connection.select_all(count_statement.to_sql).first['count'].to_i

      # order by simple_product_offers.id to put offers at top
      statement.order('case when simple_product_offers.id is null then 1 else 0 end')

      # limit and offset the statement
      if context[:offset] && context[:limit]
        statement.take(context[:limit]).skip(context[:offset])

        number_pages = (length / (context[:limit].to_f)).ceil
      else
        number_pages = 1
      end

      # get results
      result = connection.select_all(statement.to_sql)

      # map the results to a hash, with extra attributes from
      # different tables, which we didn't include at the beginning
      # because we don't use them to filter. include metadata
      # describing the result, the resulting hash will look like
      #{
      #  product_type_id: 1,
      #  valid_from: 1/1/2015,
      #  list_description: "Desc",
      #  short_description: "Desc".
      #  long_description: "Desc",
      #  price: 12.99
      #  sale_price: 10.00 or null
      #  offer_list_description "Sale Desc" or null
      #  simple_product_offer_id: 1 or null
      #}
      {
          metadata:
              {
                  length: length,
                  number_pages: number_pages
              },
          results_hash_array:
              result.map do |row|
                product_type = ProductType.find(row['product_type_id'])
                images = product_type.images
                primary_image = (images.detect { |i| i.data.url == product_type.custom_fields['Main Image'] })
                images = images.where('file_assets.id != ?', primary_image.id).map { |i| i.data.url }
                primary_image = primary_image.data.url

                row.merge({
                              images: images,
                              primary_image: primary_image
                          }).symbolize_keys
              end
      }
    end

    private

    def apply_filters(statement)
      # define the tables and aliased tables
      product_types = ProductType.arel_table

      product_offers = ProductOffer.arel_table
      simple_product_offers = SimpleProductOffer.arel_table

      pricing_plan_assignments = PricingPlanAssignment.arel_table
      pricing_plans = PricingPlan.arel_table
      product_type_pricing_plan_assignments = pricing_plan_assignments.alias('product_type_pricing_plan_assignments')
      simple_product_offer_pricing_plan_assignments = pricing_plan_assignments.alias('simple_product_offer_pricing_plan_assignments')
      product_type_pricing_plans = pricing_plans.alias('product_type_pricing_plans')
      simple_product_offer_pricing_plans = pricing_plans.alias('simple_product_offer_pricing_plans')

      descriptive_assets = DescriptiveAsset.arel_table
      list_descriptive_assets = descriptive_assets.alias('list_descriptive_assets')
      short_descriptive_assets = descriptive_assets.alias('short_descriptive_assets')
      long_descriptive_assets = descriptive_assets.alias('long_descriptive_assets')
      view_types = ViewType.arel_table
      category_classifications = CategoryClassification.arel_table

      # filter product types at the beginning if possible
      if @context[:product_type_id]
        statement = statement.where(product_types[:id].eq(ActiveRecord::Base::sanitize(@context[:product_type_id])))
        # define our big, combined table with offer-less product types and valid-offered product types
        statement = statement.
            join(simple_product_offers, Arel::Nodes::OuterJoin).on(simple_product_offers[:product_type_id].eq(ActiveRecord::Base::sanitize(@context[:product_type_id]))).
            join(product_offers, Arel::Nodes::OuterJoin).on(product_offers[:product_offer_record_type].eq('SimpleProductOffer').and(product_offers[:product_offer_record_id].eq(simple_product_offers[:id]))).
            join(product_type_pricing_plan_assignments).on(product_type_pricing_plan_assignments[:priceable_item_type].eq('ProductType').and(product_type_pricing_plan_assignments[:priceable_item_id].eq(ActiveRecord::Base::sanitize(@context[:product_type_id])))).
            join(simple_product_offer_pricing_plan_assignments, Arel::Nodes::OuterJoin).on(simple_product_offer_pricing_plan_assignments[:priceable_item_type].eq('SimpleProductOffer').and(simple_product_offer_pricing_plan_assignments[:priceable_item_id].eq(simple_product_offers[:id]))).
            join(product_type_pricing_plans).on(product_type_pricing_plans[:id].eq(product_type_pricing_plan_assignments[:pricing_plan_id])).
            join(simple_product_offer_pricing_plans, Arel::Nodes::OuterJoin).on(simple_product_offer_pricing_plans[:id].eq(simple_product_offer_pricing_plan_assignments[:pricing_plan_id])).
            join(list_descriptive_assets, Arel::Nodes::OuterJoin).on(list_descriptive_assets[:described_record_id].eq(ActiveRecord::Base::sanitize(@context[:product_type_id])).and(list_descriptive_assets[:described_record_type].eq('ProductType')).and(list_descriptive_assets[:view_type_id].in(view_types.project(view_types[:id]).where(view_types[:internal_identifier].eq('list_description'))))).
            join(short_descriptive_assets, Arel::Nodes::OuterJoin).on(short_descriptive_assets[:described_record_id].eq(ActiveRecord::Base::sanitize(@context[:product_type_id])).and(short_descriptive_assets[:described_record_type].eq('ProductType')).and(short_descriptive_assets[:view_type_id].in(view_types.project(view_types[:id]).where(view_types[:internal_identifier].eq('short_description'))))).
            join(long_descriptive_assets, Arel::Nodes::OuterJoin).on(long_descriptive_assets[:described_record_id].eq(ActiveRecord::Base::sanitize(@context[:product_type_id])).and(long_descriptive_assets[:described_record_type].eq('ProductType')).and(long_descriptive_assets[:view_type_id].in(view_types.project(view_types[:id]).where(view_types[:internal_identifier].eq('long_description'))))).
            join(category_classifications).on(category_classifications[:classification_type].eq('ProductType').and(category_classifications[:classification_id].eq(ActiveRecord::Base::sanitize(@context[:product_type_id])))).
            where(simple_product_offers[:id].eq(product_offers[:product_offer_record_id]).or(simple_product_offers[:product_type_id].eq(nil)))
      else
        # define our big, combined table with offer-less product types and valid-offered product types
        statement = statement.
            join(simple_product_offers, Arel::Nodes::OuterJoin).on(simple_product_offers[:product_type_id].eq(product_types[:id])).
            join(product_offers, Arel::Nodes::OuterJoin).on(product_offers[:product_offer_record_type].eq('SimpleProductOffer').and(product_offers[:product_offer_record_id].eq(simple_product_offers[:id]))).
            join(product_type_pricing_plan_assignments).on(product_type_pricing_plan_assignments[:priceable_item_type].eq('ProductType').and(product_type_pricing_plan_assignments[:priceable_item_id].eq(product_types[:id]))).
            join(simple_product_offer_pricing_plan_assignments, Arel::Nodes::OuterJoin).on(simple_product_offer_pricing_plan_assignments[:priceable_item_type].eq('SimpleProductOffer').and(simple_product_offer_pricing_plan_assignments[:priceable_item_id].eq(simple_product_offers[:id]))).
            join(product_type_pricing_plans).on(product_type_pricing_plans[:id].eq(product_type_pricing_plan_assignments[:pricing_plan_id])).
            join(simple_product_offer_pricing_plans, Arel::Nodes::OuterJoin).on(simple_product_offer_pricing_plans[:id].eq(simple_product_offer_pricing_plan_assignments[:pricing_plan_id])).
            join(list_descriptive_assets, Arel::Nodes::OuterJoin).on(list_descriptive_assets[:described_record_id].eq(product_types[:id]).and(list_descriptive_assets[:described_record_type].eq('ProductType')).and(list_descriptive_assets[:view_type_id].in(view_types.project(view_types[:id]).where(view_types[:internal_identifier].eq('list_description'))))).
            join(short_descriptive_assets, Arel::Nodes::OuterJoin).on(short_descriptive_assets[:described_record_id].eq(product_types[:id]).and(short_descriptive_assets[:described_record_type].eq('ProductType')).and(short_descriptive_assets[:view_type_id].in(view_types.project(view_types[:id]).where(view_types[:internal_identifier].eq('short_description'))))).
            join(long_descriptive_assets, Arel::Nodes::OuterJoin).on(long_descriptive_assets[:described_record_id].eq(product_types[:id]).and(long_descriptive_assets[:described_record_type].eq('ProductType')).and(long_descriptive_assets[:view_type_id].in(view_types.project(view_types[:id]).where(view_types[:internal_identifier].eq('long_description'))))).
            join(category_classifications).on(category_classifications[:classification_type].eq('ProductType').and(category_classifications[:classification_id].eq(product_types[:id]))).
            where(simple_product_offers[:id].eq(product_offers[:product_offer_record_id]).or(simple_product_offers[:product_type_id].eq(nil)))
        # filter by category
        if @context[:category_id]
          statement = statement.where(category_classifications[:category_id].eq(ActiveRecord::Base::sanitize(@context[:category_id]).to_i))
        end

        # filter between two prices: [low,high]
        if @context[:price_range]
          statement = statement.where(
              (product_type_pricing_plans[:money_amount].gteq(ActiveRecord::Base::sanitize(@context[:price_range][0])).and(product_type_pricing_plans[:money_amount].lteq(ActiveRecord::Base::sanitize(@context[:price_range][1])))).
                  or(simple_product_offer_pricing_plans[:money_amount].gteq(ActiveRecord::Base::sanitize(@context[:price_range][0])).and(simple_product_offer_pricing_plans[:money_amount].lteq(ActiveRecord::Base::sanitize(@context[:price_range][1]))).and(product_offers[:valid_from].lt(Time.now.utc)).and(product_offers[:valid_to].gt(Time.now.utc)))
          )
        end

        # filter descriptive assets by keyword
        if @context[:keyword]
          statement = statement.where(short_descriptive_assets[:description].lower.matches("%#{ActiveRecord::Base::sanitize(@context[:keyword].downcase)[1..@context[:keyword].length]}%").or(list_descriptive_assets[:description].lower.matches("%#{ActiveRecord::Base::sanitize(@context[:keyword].downcase)[1..@context[:keyword].length]}%")))
        end
      end

      statement
    end

  end # BasicOfferEngine
end # ErpCommerce
