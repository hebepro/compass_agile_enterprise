class UpdateInvoiceable < ActiveRecord::Migration
  def up
    create_table :invoiced_records do |t|
      t.references :invoice_item
      t.references :invoiceable_item, :polymorphic => true

      t.timestamps
    end

    add_index :invoiced_records, [:invoiceable_item_id, :invoiceable_item_type], :name => 'invoiced_records_invoiceable_item_idx'

    remove_column :invoice_items, :invoiceable_item_id
    remove_column :invoice_items, :invoiceable_item_type
  end

  def down
    drop_table :invoiced_records

    add_column :invoice_items, :invoiceable_item_id, :integer
    add_column :invoice_items, :invoiceable_item_type, :string
  end
end
