class StaffingRequisition < ActiveRecord::Base

  attr_accessible :parent_id,
                  :description,
                  :internal_identifier,
                  :expected_end,
                  :expected_start,
                  :quantity,
                  :rate
end
