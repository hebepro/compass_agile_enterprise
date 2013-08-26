## Types of goods required as a standard for the completion of work efforts. This is different from
## inventory_items because it is not for planning. It is only for noting the type of good
## that is required to perform the work effort. - See DMRB v1, pp 223-224

class GoodType < ActiveRecord::Base
  # attr_accessible :title, :body
  attr_protected :created_at, :updated_at

  acts_as_nested_set
  include ErpTechSvcs::Utils::DefaultNestedSetMethods

end
