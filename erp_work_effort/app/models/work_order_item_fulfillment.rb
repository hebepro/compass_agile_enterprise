## This entity tracks the relationship between the
## work_order (order_line_item) and the work_effort by which it is fulfilled.

class WorkOrderItemFulfillment < ActiveRecord::Base
  # attr_accessible :title, :body
  attr_protected :created_at, :updated_at

  belongs_to  :work_effort
  belongs_to  :order_line_item

end
