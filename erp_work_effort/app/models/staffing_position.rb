class StaffingPosition < ActiveRecord::Base
  attr_accessible :description, :internal_identifier, :shift

  belongs_to :party
  belongs_to :position_type

  acts_as_product_type
end
