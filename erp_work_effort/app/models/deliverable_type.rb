class DeliverableType < ActiveRecord::Base
  # attr_accessible :title, :body

  acts_as_nested_set
  include ErpTechSvcs::Utils::DefaultNestedSetMethods

  has_many :deliverables

end
