class AddValidDateColumnsToProductOffer < ActiveRecord::Migration
  def up
    add_column :product_offers, :valid_from, :date
    add_column :product_offers, :valid_to, :date

    add_index :product_offers, :valid_from
    add_index :product_offers, :valid_to
  end

  def down
    remove_column :product_offers, :valid_from
    remove_column :product_offers, :valid_to
  end
end
