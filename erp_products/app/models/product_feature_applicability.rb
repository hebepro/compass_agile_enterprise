class ProductFeatureApplicability < ActiveRecord::Base
  attr_protected :created_at, :updated_at

  belongs_to :feature_of_record, polymorphic: true
  belongs_to :product_feature
end
