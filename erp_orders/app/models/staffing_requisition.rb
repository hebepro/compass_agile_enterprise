class StaffingRequisition < ActiveRecord::Base
  # create_table :staffing_requisitions do |t|
  #   t.integer :parent_id
  #   t.string :description
  #   t.string :internal_identifier
  #   t.string :shift
  #   t.decimal :rate, :precision => 8, :scale => 2
  #   t.integer :staffing_position_id
  #   t.date :expected_start
  #   t.date :expected_end
  #   t.integer :quantity
  #   t.text :custom_fields
  #   t.timestamps

  attr_accessible :parent_id,
                  :description,
                  :internal_identifier,
                  :expected_end,
                  :expected_start,
                  :quantity,
                  :rate,
                  :shift,
                  :staffing_position_id
end
