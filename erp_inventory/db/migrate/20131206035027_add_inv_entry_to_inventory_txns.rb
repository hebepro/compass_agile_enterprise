class AddInvEntryToInventoryTxns < ActiveRecord::Migration
  def change

    #Where are we picking inventory up from
    add_column :inventory_pickup_txns, :inventory_entry_id, :integer

    #Where are we placing the inventory. Can be final destination or interim destination
    #For inventory movements
    add_column :inventory_dropoff_txns, :inventory_entry_id, :integer

    add_index :inventory_pickup_txns, :inventory_entry_id
    add_index :inventory_dropoff_txns, :inventory_entry_id

  end
end
