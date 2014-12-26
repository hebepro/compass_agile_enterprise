# create_table :view_types do |t|
#   t.string :internal_identifier
#   t.string :description
#
#   # these columns are required to support the behavior of the plugin 'awesome_nested_set'
#   t.integer :lft
#   t.integer :rgt
#   t.integer :parent_id
#
#   t.timestamps
# end

class ViewType < ActiveRecord::Base
  attr_protected :created_at, :updated_at

  acts_as_nested_set

  has_many :descriptive_assets
end
