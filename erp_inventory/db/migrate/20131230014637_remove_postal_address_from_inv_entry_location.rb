#NOTE:
#The reason we are removing postal address from InventoryEntryLocation is that
#the location of an inventory entry will be calculated differently depending
#on the type of facility in which it is stored.
#
#If it is stored in a fixed location faciity, the postal address will come from
#the facility. If it is a mobile facility (a truck), the location will be
#calculated based on the current location of the facility/truck/vehicle/PODS

class RemovePostalAddressFromInvEntryLocation < ActiveRecord::Migration

  def change
    remove_column :inventory_entry_locations, :postal_address_id
  end

end
