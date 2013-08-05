class WorkEffortPartyRole < ActiveRecord::Base

  belongs_to  :work_effort
  belongs_to  :party
  belongs_to  :role_type

end