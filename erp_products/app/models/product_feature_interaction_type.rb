class ProductFeatureInteractionType < ActiveRecord::Base
  attr_protected :created_at, :updated_at

  has_many :product_feature_interactions, dependent: :destroy

  def self.iid(string)
    self.where(internal_identifier:string).last
  end
end
