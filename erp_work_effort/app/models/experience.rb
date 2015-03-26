class Experience < ActiveRecord::Base

  is_json :custom_fields

  belongs_to :party
  belongs_to :experience_type

  attr_protected :created_at, :updated_at
  attr_accessible :description

end
