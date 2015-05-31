class Category < ActiveRecord::Base
  acts_as_nested_set

  include ErpTechSvcs::Utils::DefaultNestedSetMethods
  acts_as_erp_type

  attr_protected :created_at, :updated_at

  belongs_to :category_record, :polymorphic => true
  has_many :category_classifications, :dependent => :destroy
  
  def self.iid( internal_identifier_string )
    where("internal_identifier = ?",internal_identifier_string.to_s).first
  end

  def to_record_representation(root = Category.root)
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

  def self.to_all_representation(root = Category.root)
    # returns an array of hashes which represent all categories in nested set order,
    # each of which consists of the category's id and representation
    container_arr = []
    each_with_level(root.self_and_descendants) do |o, level|
      container_arr << {:id => o.id, :description => o.to_representation}
    end
    container_arr
  end

  def to_data_hash
    {
        server_id: id,
        leaf: children.empty?,
        description: description,
        internal_identifier: internal_identifier,
        created_at: created_at,
        updated_at: updated_at
    }
  end

  private

  def crawl_up_from(category, to_category = Category.root)
    # returns a string that is a '///'-separated list of categories
    # from child category to root
    "#{category.description}///#{crawl_up_from(category.parent, to_category) if category != to_category}"
  end

end
