#### Table Definition ###########################
#  create_table :invoice_items do |t|
#    #foreign keys
#    t.references :invoice
#    t.references :invoice_item_type
#
#    #non-key columns
#    t.integer    :item_seq_id
#    t.string     :item_description
#    t.decimal    :unit_price, :precision => 8, :scale => 2
#    t.boolean    :taxable
#    t.decimal    :tax_rate, :precision => 8, :scale => 2
#    t.decimal    :quantity, :precision => 8, :scale => 2
#    t.decimal    :amount, :precision => 8, :scale => 2
#
#    t.timestamps
#  end

#  add_index :invoice_items, :invoice_id, :name => 'invoice_id_idx'
#  add_index :invoice_items, :invoice_item_type_id, :name => 'invoice_item_type_id_idx'
#################################################

class InvoiceItem < ActiveRecord::Base
  attr_protected :created_at, :updated_at

  belongs_to :invoice
  belongs_to :agreement
  belongs_to :invoice_item_type

  has_many :invoiced_records, :dependent => :destroy

  has_payment_applications

  def total_amount
    if taxable?
      ((self.unit_price * self.quantity) + self.sales_tax)
    else
      (self.unit_price * self.quantity)
    end
  end

  def balance
    self.total_amount - self.total_payments
  end

  def taxable?
    taxable && !tax_rate.nil?
  end

  def sales_tax
    if taxable?
      tax_rate * unit_price
    else
      'N/A'
    end
  end

  def add_invoiced_record(record)
    invoiced_records << InvoicedRecord.new(invoiceable_item: record)
  end

  def to_s
    item_description
  end

  def to_label
    to_s
  end

end
