class ProductFeatureType < ActiveRecord::Base
  attr_accessible :custom_fields, :description, :external_id, :external_identifer, :internal_identifer, :lft, :parent_id, :rgt
  has_many :product_feature_type_product_feature_values, dependent: :destroy
  has_many :product_feature_values, through: :product_feature_type_product_feature_values

  has_many :product_features, dependent: :destroy

  is_json :custom_fields

  acts_as_nested_set
  include ErpTechSvcs::Utils::DefaultNestedSetMethods  # acts_as_nested_set


  def self.iid(description)
    self.where("lower(description) = ?", description.downcase).first
  end

  def to_record_representation(root = ProductFeatureType.root)
    # returns a string of category descriptions like
    # 'main_category > sub_category n > ... > this category instance'
    if root?
      description
    else
      crawl_up_from(self, root).split('///').reverse.join(' > ')
    end
  end

  def to_representation
    # returns a string that consists of 1) a number of dashes equal to
    # the category's level and 2) the category's description attr
    rep = ''
    level.times {rep << '- '}
    rep << description
  end

  def self.to_all_representation(root = ProductFeatureType.root)
    # returns an array of hashes which represent all categories in nested set order,
    # each of which consists of the category's id and representation
    container_arr = []
    each_with_level(root.self_and_descendants) do |o, level|
      container_arr << {:id => o.id, :description => o.to_representation}
    end
    container_arr
  end

  private

  def crawl_up_from(product_feature_type, to_product_feature_type = ProductFeatureType.root)
    # returns a string that is a '///'-separated list of categories
    # from child category to root
    "#{product_feature_type.description}///#{crawl_up_from(product_feature_type.parent, to_product_feature_type) if product_feature_type != to_product_feature_type}"
  end
end
