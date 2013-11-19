# This migration comes from erp_orders (originally 20131005232344)
class UpdateOrderLinePtyRoleIndexes < ActiveRecord::Migration
  def change

    execute 'DROP INDEX index_order_line_item_pty_roles_on_biz_txn_acct_root_id;'
    execute 'DROP INDEX index_order_line_item_pty_roles_on_order_line_item_id;'
    execute 'DROP INDEX index_order_line_item_pty_roles_on_line_item_role_type_id;'

    remove_column :order_line_item_pty_roles, :line_item_role_type_id

    add_column :order_line_item_pty_roles, :role_type_id, :integer
    add_index  :order_line_item_pty_roles, :role_type_id, :name => 'order_line_item_pty_role_role_type_idx'

    add_index  :order_line_item_pty_roles, :biz_txn_acct_root_id, :name => 'order_line_item_pty_role_biz_txn_acct_root_idx'
    add_index  :order_line_item_pty_roles, :order_line_item_id, :name => 'order_line_item_pty_role_order_line_item_idx'

  end

end
