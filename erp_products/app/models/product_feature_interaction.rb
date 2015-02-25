class ProductFeatureInteraction < ActiveRecord::Base
  attr_protected :created_at, :updated_at

  belongs_to :product_feature
  belongs_to :interacted_product_feature, class_name: "ProductFeature"
  belongs_to :product_feature_interaction_type

  is_json :custom_fields
end
