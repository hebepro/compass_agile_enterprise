class CreateProductFeatureApplicabilities < ActiveRecord::Migration
  def change
    create_table :product_feature_applicabilities do |t|
      t.integer :feature_of_record_id
      t.string :feature_of_record_type
      t.integer :product_feature_id
      t.boolean :is_mandatory

      t.timestamps
    end
  end
end
