class WorkOrderItem < ActiveRecord::Base
  attr_protected :created_at, :updated_at

  acts_as_order_line_item
end