class AddProductOfferDescriptionOrderLineItem < ActiveRecord::Migration
  def up
    add_column :order_line_items, :product_offer_description, :string
  end

  def down
    remove_column :order_line_items, :product_offer_description
  end
end
