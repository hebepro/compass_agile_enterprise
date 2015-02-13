class CreateProductFeatureInteractions < ActiveRecord::Migration
  def change
    create_table :product_feature_interactions do |t|
      t.integer :product_feature_id
      t.integer :interacted_product_feature_id
      t.integer :product_feature_interaction_type_id
      t.hstore :custom_fields

      t.timestamps
    end
  end
end
