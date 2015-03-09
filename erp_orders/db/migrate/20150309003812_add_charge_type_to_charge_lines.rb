class AddChargeTypeToChargeLines < ActiveRecord::Migration
  def change
    add_column :charge_lines, :charge_type_id, :integer
  end
end
