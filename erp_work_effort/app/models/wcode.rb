class Wcode < ActiveRecord::Base
  attr_protected :created_at, :updated_at

  is_json :custom_fields
end
