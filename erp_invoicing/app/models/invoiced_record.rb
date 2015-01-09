class InvoicedRecord < ActiveRecord::Base

  belongs_to :invoice_item
  belongs_to :invoiceable_item, :polymorphic => true

end