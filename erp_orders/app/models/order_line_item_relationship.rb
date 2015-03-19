class OrderLineItemRelationship < ActiveRecord::Base
  attr_protected :created_at, :updated_at

  belongs_to :order_line_item_from, :class_name => "OrderLineItem", :foreign_key => "order_line_item_id_from"
  belongs_to :order_line_item_to, :class_name => "OrderLineItem", :foreign_key => "order_line_item_id_to"
  belongs_to :order_line_item_rel_type

end