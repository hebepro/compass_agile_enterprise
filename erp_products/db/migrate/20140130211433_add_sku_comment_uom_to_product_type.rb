class AddSkuCommentUomToProductType < ActiveRecord::Migration
  def change
    def change
      add_column :product_types, :sku, :string
      add_column :product_types, :comment, :text
      add_column :product_types, :unit_of_measurement_id, :integer
    end
  end
end
