class RequirementPartyRole < ActiveRecord::Base
  # attr_accessible :title, :body
  belongs_to :party
  belongs_to :role_type
  belongs_to :requirement

end
