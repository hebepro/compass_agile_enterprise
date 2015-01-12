class InvoicedRecord < ActiveRecord::Base
  attr_protected :created_at, :updated_at

  belongs_to :invoice_item
  belongs_to :invoiceable_item, :polymorphic => true

end