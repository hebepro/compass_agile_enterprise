class CreateFixedAssetPartyRoles < ActiveRecord::Migration
  def change
    create_table :fixed_asset_party_roles do |t|

      t.references :party
      t.references :fixed_asset
      t.references :role_type

      t.timestamps
    end
  end
end
