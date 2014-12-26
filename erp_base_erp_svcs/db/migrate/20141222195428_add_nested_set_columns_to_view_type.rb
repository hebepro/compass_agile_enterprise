class AddNestedSetColumnsToViewType < ActiveRecord::Migration
  def change
    add_column :view_types, :lft, :integer
    add_column :view_types, :rgt, :integer
    add_column :view_types, :parent_id, :integer

    add_index :view_types, :lft
    add_index :view_types, :rgt
    add_index :view_types, :parent_id
  end
end
