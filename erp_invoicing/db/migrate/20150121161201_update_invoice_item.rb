class UpdateInvoiceItem < ActiveRecord::Migration
  def up
    add_column :invoice_items, :taxable, :boolean
    add_column :invoice_items, :tax_rate, :decimal, :precision => 8, :scale => 2
    add_column :invoice_items, :unit_price, :decimal, :precision => 8, :scale => 2

    remove_column :invoice_items, :sales_tax
  end

  def down
    remove_column :invoice_items, :taxable
    remove_column :invoice_items, :tax_rate
    remove_column :invoice_items, :unit_price

    add_column :invoice_items, :sales_tax, :decimal, :precision => 8, :scale => 2
  end
end
