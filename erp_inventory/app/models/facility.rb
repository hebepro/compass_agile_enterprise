class Facility < ActiveRecord::Base
  attr_accessible :description, :facility_record_id, :facility_record_type, :facility_type_id, :internal_identifier
  
  #Allow for polymorphic associated subclsses of ShipmentItem
  belongs_to  :facility_record, :polymorphic => true
  belongs_to  :facility_type

  belongs_to  :postal_address
  
end
