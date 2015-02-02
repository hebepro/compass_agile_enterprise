class ProductFeatureInteraction < ActiveRecord::Base
  attr_accessible :custom_fields, :interacted_product_feature_id, :product_feature_id, :product_feature_interaction_type_id
  attr_accessible :feature_interaction_type, :interacted_product_feature_id, :product_feature_id
  belongs_to :product_feature
  belongs_to :interacted_product_feature, class_name: "ProductFeature"
  belongs_to :product_feature_interaction_type

  is_json :custom_fields
end
