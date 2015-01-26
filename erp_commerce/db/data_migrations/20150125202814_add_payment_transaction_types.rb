class AddPaymentTransactionTypes
  
  def self.up
    payment_transactions = BizTxnType.find_or_create('payment_transaction', 'Payment Transaction')
    BizTxnType.find_or_create('credit_card_payment', 'Credit Card Payment', payment_transactions)
    BizTxnType.find_or_create('cash_payment', 'Cash Payment', payment_transactions)
  end
  
  def self.down
    BizTxnType.iid('payment_transaction').destroy
  end

end
