class CreateStaffingPositions < ActiveRecord::Migration
  def change
    create_table :staffing_positions do |t|
      t.string :description
      t.string :internal_identifier
      t.string :shift

      t.timestamps
    end
  end
end
