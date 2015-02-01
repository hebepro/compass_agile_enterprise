class ProductFeatureApplicability < ActiveRecord::Base
  attr_accessible :feature_of_record_id, :feature_of_record_type, :is_mandatory, :product_feature_id
  belongs_to :feature_of_record, polymorphic: true
  belongs_to :product_feature
end
