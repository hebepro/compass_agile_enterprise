class AddShippingCostToProductTypes < ActiveRecord::Migration
  def change
    add_column :product_types, :shipping_cost, :decimal, :precision => 8, :scale => 2
  end
end
