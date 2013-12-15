class PartySkill < ActiveRecord::Base
  attr_protected :created_at, :updated_at

  belongs_to :party
  belongs_to :skill_type
end
