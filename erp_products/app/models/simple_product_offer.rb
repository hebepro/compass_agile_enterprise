class SimpleProductOffer < ActiveRecord::Base
  attr_protected :created_at, :updated_at

  is_json :custom_fields
  acts_as_product_offer

  belongs_to :product_type

  def self.available_product_offers(ctx)
    # TODO: implement ctx
    self.includes(:product_offer).where(ProductOffer.arel_table[:valid_from].lt(Time.now)).where(ProductOffer.arel_table[:valid_to].gt(Time.now))
  end
end
