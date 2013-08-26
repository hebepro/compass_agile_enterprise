class FacilityType < ActiveRecord::Base
  attr_accessible :description, :external_identifer_source, :external_identifier, :internal_identifier, :lft, :parent_id, :rgt
end
