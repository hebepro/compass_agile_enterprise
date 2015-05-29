Party.class_eval do
  has_many :resource_availabilities, :class_name => 'PartyResourceAvailability', :dependent => :destroy
  has_many :party_skills
  has_many :position_fulfillments, foreign_key: "held_by_party_id"
  has_many :experiences
  has_many :wc_codes, dependent: :destroy
  has_many :shifts, dependent: :destroy
  has_many :resumes
end
