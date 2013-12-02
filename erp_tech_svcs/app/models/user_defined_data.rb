class UserDefinedData < ActiveRecord::Base
  attr_protected :created_at, :updated_at

  has_many :user_defined_fields

end