class CreateProductFeatureTypeProductFeatureValues < ActiveRecord::Migration
  def change
    create_table :product_feature_type_product_feature_values do |t|
      t.integer :product_feature_type_id
      t.integer :product_feature_value_id

      t.timestamps
    end
  end
end
