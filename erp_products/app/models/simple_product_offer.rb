class SimpleProductOffer < ActiveRecord::Base
  attr_protected :created_at, :updated_at

  is_json :custom_fields
  acts_as_product_offer

  belongs_to :product_type

  def product_type=(value)
    unless value.is_a? ProductType
      super(ProductType.find(value.to_i))
    end
  end

end
