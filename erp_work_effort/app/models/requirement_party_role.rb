class RequirementPartyRole < ActiveRecord::Base
  attr_protected :created_at, :updated_at

  belongs_to :party
  belongs_to :role_type
  belongs_to :requirement

end
