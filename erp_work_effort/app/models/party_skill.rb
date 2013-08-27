class PartySkill < ActiveRecord::Base
  # attr_accessible :title, :body
  belongs_to :party
  belongs_to :skill_type
end
