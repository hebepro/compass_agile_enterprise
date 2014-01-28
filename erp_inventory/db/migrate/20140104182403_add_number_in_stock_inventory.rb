class AddNumberInStockInventory < ActiveRecord::Migration
  def up
    add_column :inventory_entries, :number_in_stock, :integer
  end

  def down
    remove_column :inventory_entries, :number_in_stock
  end
end
