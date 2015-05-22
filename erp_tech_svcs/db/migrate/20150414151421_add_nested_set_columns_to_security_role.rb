class AddNestedSetColumnsToSecurityRole < ActiveRecord::Migration
  def change
    add_column :security_roles, :lft, :integer
    add_column :security_roles, :rgt, :integer
    add_column :security_roles, :parent_id, :integer

    add_index :security_roles, :parent_id
    add_index :security_roles, :lft
    add_index :security_roles, :rgt

    SecurityRole.rebuild!
  end
end
