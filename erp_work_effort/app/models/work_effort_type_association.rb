## work_effort type associations - standard for associations between work_efforts

class WorkEffortTypeAssociation < ActiveRecord::Base
  # attr_accessible :title, :body
  attr_protected :created_at, :updated_at

  belongs_to :work_effort_from_type, :class_name => "WorkEffort", :foreign_key => "work_effort_type_id_from"
  belongs_to :work_effort_to_type, :class_name => "WorkEffort", :foreign_key => "work_effort_type_id_to"

end
