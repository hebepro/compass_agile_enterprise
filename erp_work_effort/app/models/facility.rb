class Facility < ActiveRecord::Base
  attr_accessible :description, :facility_record_id, :facility_record_type, :facility_type_id, :internal_identifier
  
  #Allow for polymorphic associated subclsses of Facility
  belongs_to :facility_record, :polymorphic => true
  belongs_to :facility_type
  
end
