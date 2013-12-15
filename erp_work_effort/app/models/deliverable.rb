class Deliverable < ActiveRecord::Base
  attr_protected :created_at, :updated_at

  belongs_to :deliverable_type
  belongs_to :deliverable_record, :polymorphic => true

end
