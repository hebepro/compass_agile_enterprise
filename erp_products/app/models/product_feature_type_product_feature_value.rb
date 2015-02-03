class ProductFeatureTypeProductFeatureValue < ActiveRecord::Base
  attr_accessible :product_feature_type_id, :product_feature_value_id
  belongs_to :product_feature_type
  belongs_to :product_feature_value
end
