class AddUomToOrderLineItem < ActiveRecord::Migration
  def up
    unless columns(:order_line_items).collect {|c| c.name}.include?('unit_of_measurement_id')
      add_column :order_line_items, :unit_of_measurement_id, :integer
    end
  end

  def self.down
    if columns(:order_line_items).collect {|c| c.name}.include?('unit_of_measurement_id')
      remove_column :order_line_items, :unit_of_measurement_id
    end
  end
end
