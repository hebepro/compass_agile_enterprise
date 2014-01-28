class PartyUnitOfMeasurement < ActiveRecord::Base
  attr_accessible :description, :scope_filter, :party_id, :unit_of_measurement_id, :internal_identifier
  belongs_to :party
  belongs_to :unit_of_measurement

end
