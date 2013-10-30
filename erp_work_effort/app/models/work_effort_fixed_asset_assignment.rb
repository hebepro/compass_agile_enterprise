##********************************************************************************************
## Work Effort Assignments - what is necessary to complete this work effort - Fixed Assets
## like equipment / tools
##********************************************************************************************
class WorkEffortFixedAssetAssignment < ActiveRecord::Base
  attr_protected :created_at, :updated_at
  # attr_accessible :title, :body
  belongs_to  :work_effort
  belongs_to  :fixed_asset
end
