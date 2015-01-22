class AddAvailableOnWebToProductType < ActiveRecord::Migration
  def change
    add_column :product_types, :available_on_web, :boolean
    add_index :product_types, :available_on_web
  end
end
