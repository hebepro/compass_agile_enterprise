class WorkOrderItem < ActiveRecord::Base
  acts_as_order_line_item
end