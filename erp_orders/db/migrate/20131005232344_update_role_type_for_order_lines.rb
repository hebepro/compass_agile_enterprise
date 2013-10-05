class UpdateRoleTypeForOrderLines < ActiveRecord::Migration
  def change

    remove_index  :order_line_item_pty_roles, :line_item_role_type_id
    remove_column :order_line_item_pty_roles, :line_item_role_type_id

    add_column :order_line_item_pty_roles, :role_type_id, :integer
    add_index  :order_line_item_pty_roles, :role_type_id

  end

end
