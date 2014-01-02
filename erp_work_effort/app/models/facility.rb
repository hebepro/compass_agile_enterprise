class Facility < ActiveRecord::Base
  attr_accessible :description, :facility_record_id, :facility_record_type, :facility_type_id, :internal_identifier
  attr_protected :created_at, :updated_at

  acts_as_fixed_asset

  #Allow for polymorphic associated subclsses of Facility
  belongs_to  :facility_record, :polymorphic => true
  belongs_to  :facility_type

  belongs_to  :postal_address

end
