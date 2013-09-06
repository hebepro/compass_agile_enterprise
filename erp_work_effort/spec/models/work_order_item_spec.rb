require 'spec_helper'

describe WorkOrderItem do
  it "can be instantiated" do
    WorkOrderItem.new.should be_an_instance_of(WorkOrderItem)
  end

  it "can be saved successfully" do
    WorkOrderItem.create().should be_persisted
  end

  it "WorkOrderItem acts_as_order_line_item" do
    woi = WorkOrderItem.new
    woi.save

    woi.should be_an_instance_of(WorkOrderItem)
    woi.should be_persisted

    # test creation of OrderLineItem
    woi.order_line_item.should be_an_instance_of(OrderLineItem)
    woi.order_line_item.should be_persisted

    # test destruction of OrderLineItem
    order_line_item_id = woi.order_line_item.id
    woi.destroy
    WorkOrderItem.where(:id => order_line_item_id).should_not exist
  end
  
end