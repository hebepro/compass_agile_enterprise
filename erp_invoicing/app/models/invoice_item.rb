#### Table Definition ###########################
#  create_table :invoice_items do |t|
#    #foreign keys
#    t.references :invoice
#    t.references :invoice_item_type
#
#    #these columns support the polymporphic relationship to invoice-able items
#    t.references :invoiceable_item, :polymorphic => true
#
#    #non-key columns
#    t.integer    :item_seq_id
#    t.string     :item_description
#    t.decimal    :sales_tax, :precision => 8, :scale => 2
#    t.decimal    :quantity, :precision => 8, :scale => 2
#    t.decimal    :amount, :precision => 8, :scale => 2
#
#    t.timestamps
#  end

#  add_index :invoice_items, [:invoiceable_item_id, :invoiceable_item_type], :name => 'invoiceable_item_idx'
#  add_index :invoice_items, :invoice_id, :name => 'invoice_id_idx'
#  add_index :invoice_items, :invoice_item_type_id, :name => 'invoice_item_type_id_idx'
#################################################

class InvoiceItem < ActiveRecord::Base
  attr_protected :created_at, :updated_at

  belongs_to :agreement
  belongs_to :invoice_item_type

  has_many :invoiced_records

  has_payment_applications

  def total_amount
    (self.amount * self.quantity)
  end

  def balance
    self.total_amount - self.total_payments
  end

  def add_invoiced_record(record)
    invoiced_records << InvoicedRecord.new(invoiceable_item: record)
  end

  def to_s
    description
  end

  def to_label
    to_s
  end

end
