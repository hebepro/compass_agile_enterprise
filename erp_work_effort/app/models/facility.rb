class Facility < ActiveRecord::Base
  attr_protected :created_at, :updated_at
  
  #Allow for polymorphic associated subclsses of Facility
  belongs_to :facility_record, :polymorphic => true
  belongs_to :facility_type
  
end
