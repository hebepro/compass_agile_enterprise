class CreateStaffingPositions < ActiveRecord::Migration
  def change
    unless table_exists?(:staffing_positions)
      create_table :staffing_positions do |t|
        t.string :internal_identifier
        t.text   :custom_fields
        t.timestamps
      end
    end
  end
end
