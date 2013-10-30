class RequirementType < ActiveRecord::Base
  # attr_accessible :title, :body
  attr_protected :created_at, :updated_at

  acts_as_nested_set
  include ErpTechSvcs::Utils::DefaultNestedSetMethods

end
