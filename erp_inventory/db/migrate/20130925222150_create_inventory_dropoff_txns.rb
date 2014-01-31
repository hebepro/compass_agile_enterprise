class CreateInventoryDropoffTxns < ActiveRecord::Migration
  def change
    create_table :inventory_dropoff_txns do |t|

      t.references  :fixed_asset
      t.string      :description
      t.integer     :quantity
      t.integer     :unit_of_measurement_id
      t.text        :comment

      t.timestamps

    end

    add_index :inventory_dropoff_txns, :fixed_asset_id

  end
end
