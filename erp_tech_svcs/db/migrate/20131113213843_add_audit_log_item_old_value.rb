class AddAuditLogItemOldValue < ActiveRecord::Migration
  def up
    unless AuditLogItem.columns.include?(:audit_log_item_old_value)
      add_column :audit_log_items, :audit_log_item_old_value, :string
    end
  end

  def down
    if AuditLogItem.columns.include?(:audit_log_item_old_value)
      remove_column :audit_log_items, :audit_log_item_old_value
    end
  end
end
