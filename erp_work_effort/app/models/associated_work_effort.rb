# EXAMPLE USAGE of has_many_polymorphic with AssociatedWorkEffort 
# WorkEffort.class_eval do     
#     has_many_polymorphic :associated_records,
#                :through => :associated_work_efforts,
#                :models => [:shipment_items]    
# end
class AssociatedWorkEffort < ActiveRecord::Base
  attr_protected :created_at, :updated_at

  belongs_to :work_effort
  belongs_to :associated_record, :polymorphic => true
end