class AddDimensionsToProductTypes < ActiveRecord::Migration
  def change
  	add_column :product_types, :length, :decimal
  	add_column :product_types, :width, :decimal
  	add_column :product_types, :height, :decimal
  	add_column :product_types, :weight, :decimal
  	add_column :product_types, :cylindrical, :boolean
  	remove_column :product_types, :shipping_cost
  end
end
