class AddIidIndexToRoleTypes < ActiveRecord::Migration
  def up
    add_index :role_types, :internal_identifier, :name => "role_types_iid_idx" unless indexes(:role_types).collect {|i| i.name}.include?('role_types_iid_idx')    
  end

  def down
    remove_index :role_types, :internal_identifier if indexes(:role_types).collect {|i| i.name}.include?('role_types_iid_idx')    
  end
end
