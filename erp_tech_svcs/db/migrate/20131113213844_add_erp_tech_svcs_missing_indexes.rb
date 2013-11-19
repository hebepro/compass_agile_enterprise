class AddErpTechSvcsMissingIndexes < ActiveRecord::Migration
  def up
    if indexes(:role_types).select { |index| index.name == 'role_types_parent_id_idx' }.empty?
      add_index :role_types, :parent_id, :name => 'role_types_parent_id_idx'
      add_index :security_roles, :internal_identifier, :name => 'security_roles_internal_identifier_idx'
      add_index :audit_logs, :audit_log_type_id, :name => 'audit_logs_audit_log_type_id_idx'
      add_index :audit_log_types, :internal_identifier, :name => 'audit_log_types_internal_identifier_idx'
      add_index :audit_log_types, :parent_id, :name => 'audit_log_types_parent_id_idx'
      add_index :audit_log_items, :audit_log_id, :name => 'audit_log_items_audit_log_id_idx'
      add_index :audit_log_items, :audit_log_item_type_id, :name => 'audit_log_items_audit_log_item_type_id_idx'
      add_index :audit_log_item_types, :internal_identifier, :name => 'audit_log_item_types_internal_identifier_idx'
      add_index :audit_log_item_types, :parent_id, :name => 'audit_log_item_types_parent_id_idx'
      add_index :capability_types, :internal_identifier, :name => 'capability_types_internal_identifier_idx'
    end
  end

  def down
    unless indexes(:role_types).select { |index| index.name == 'role_types_parent_id_idx' }.empty?
      remove_index :role_types, :parent_id
      remove_index :security_roles, :internal_identifier
      remove_index :audit_logs, :audit_log_type_id
      remove_index :audit_log_types, :internal_identifier
      remove_index :audit_log_types, :parent_id
      remove_index :audit_log_items, :audit_log_id
      remove_index :audit_log_items, :audit_log_item_type_id
      remove_index :audit_log_item_types, :internal_identifier
      remove_index :audit_log_item_types, :parent_id
      remove_index :capability_types, :internal_identifier
    end
  end
end
