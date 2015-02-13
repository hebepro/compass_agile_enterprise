class CreateProductFeatureInteractionTypes < ActiveRecord::Migration
  def change
    create_table :product_feature_interaction_types do |t|
      t.string :internal_identifier
      t.string :description

      t.timestamps
    end
  end
end
