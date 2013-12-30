class ChangeFixedAssetToFacilityForInventoryLocations < ActiveRecord::Migration

  def change
    remove_column :inventory_entry_locations, :fixed_asset_id
    add_column  :inventory_entry_locations, :facility_id, :integer
  end

end
