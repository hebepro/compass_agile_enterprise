OrderTxn.class_eval do

  def has_generated_invoice?
    (Invoice.items_generated_by(self).count != 0)
  end

end