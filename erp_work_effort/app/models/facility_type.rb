class FacilityType < ActiveRecord::Base
  attr_accessible :description, :external_identifer_source, :external_identifier, :internal_identifier, :lft, :parent_id, :rgt

  acts_as_nested_set
  include ErpTechSvcs::Utils::DefaultNestedSetMethods

  has_many :facilities
end
