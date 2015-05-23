class AddIidToChargeType < ActiveRecord::Migration
  def change
    add_column :charge_types, :internal_identifier, :string
  end
end
