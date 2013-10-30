class Deliverable < ActiveRecord::Base
  # attr_accessible :title, :body

  belongs_to :deliverable_type
  belongs_to :deliverable_record, :polymorphic => true

end
