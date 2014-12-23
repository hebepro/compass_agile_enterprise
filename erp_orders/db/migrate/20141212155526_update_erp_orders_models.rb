class UpdateErpOrdersModels < ActiveRecord::Migration
  def up
    remove_column :order_txns, :state_machine
    remove_column :order_txns, :status

    remove_column :order_line_items, :product_id
    remove_column :order_line_items, :product_description

    add_index :order_line_items, :unit_of_measurement_id, :name => 'uom_order_line_item_idx'
  end

  def down
    add_column :order_txns, :state_machine, :string
    add_column :order_txns, :status, :string

    add_column :order_line_items, :product_id, :integer
    add_column :order_line_items, :product_description, :string
  end
end
