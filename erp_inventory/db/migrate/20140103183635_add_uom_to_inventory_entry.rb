class AddUomToInventoryEntry < ActiveRecord::Migration
  def change
    add_column :inventory_entries, :unit_of_measurement_id, :integer
  end
end
