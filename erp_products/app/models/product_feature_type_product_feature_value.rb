class ProductFeatureTypeProductFeatureValue < ActiveRecord::Base
  attr_protected :created_at, :updated_at

  belongs_to :product_feature_type
  belongs_to :product_feature_value
end
