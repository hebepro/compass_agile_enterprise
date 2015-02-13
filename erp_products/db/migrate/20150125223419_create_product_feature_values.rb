class CreateProductFeatureValues < ActiveRecord::Migration
  def change
    create_table :product_feature_values do |t|
      t.string :value
      t.string :internal_identifier
      t.string :external_identifier
      t.string :external_id_source
      t.string :description
      t.hstore :custom_fields

      t.timestamps
    end
  end
end
