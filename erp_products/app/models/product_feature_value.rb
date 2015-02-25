class ProductFeatureValue < ActiveRecord::Base
  attr_protected :created_at, :updated_at

  has_many :product_feature_type_product_feature_values, dependent: :destroy
  has_many :product_feature_types, through: :product_feature_type_product_feature_values

  has_many :product_features, dependent: :destroy
end
