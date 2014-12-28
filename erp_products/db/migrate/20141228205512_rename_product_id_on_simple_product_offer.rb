class RenameProductIdOnSimpleProductOffer < ActiveRecord::Migration
  def up
    rename_column :simple_product_offers, :product_id, :product_type_id
  end

  def down
    rename_column :simple_product_offers, :product_type_id, :product_id
  end
end
