class UserDefinedField < ActiveRecord::Base
  attr_protected :created_at, :updated_at

  belongs_to :user_defined_data

  validates_uniqueness_of :field_name, :scope => [:user_defined_data_id]

end