class CreateProductFeatureTypes < ActiveRecord::Migration
  def change
    create_table :product_feature_types do |t|
      t.string :description
      t.integer :parent_id
      t.integer :lft
      t.integer :rgt
      t.string :internal_identifier
      t.string :external_identifier
      t.string :external_id
      t.hstore :custom_fields

      t.timestamps
    end
  end
end
