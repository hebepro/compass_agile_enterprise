class CreateProductFeatures < ActiveRecord::Migration
  def change
    create_table :product_features do |t|
      t.integer :product_feature_type_id
      t.integer :product_feature_value_id
      t.hstore :custom_fields

      t.timestamps
    end
  end
end
