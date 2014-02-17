class AddTypeColumnToProductTypes < ActiveRecord::Migration
  def up
    add_column :product_types, :type, :string
  end

  def down
    remove_column :product_types, :type
  end
end
