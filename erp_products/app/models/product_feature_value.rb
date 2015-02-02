class ProductFeatureValue < ActiveRecord::Base
  attr_accessible :custom_fields, :description, :external_id_source, :external_identifier, :internal_identifier, :value
  has_many :product_feature_type_product_feature_values, dependent: :destroy
  has_many :product_feature_types, through: :product_feature_type_product_feature_values

  has_many :product_features, dependent: :destroy

  is_json :custom_fields
end
