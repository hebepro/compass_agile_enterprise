class CreateInventoryEntryLocations < ActiveRecord::Migration
  def change
    create_table :inventory_entry_locations do |t|

      t.references  :inventory_entry
      t.references  :fixed_asset
      t.datetime    :valid_from
      t.datetime    :valid_thru

      t.timestamps
    end
  end
end
