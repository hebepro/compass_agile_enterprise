class AddAccountOwner
  
  def self.up
    BizTxnAcctPtyRtype.create(description: 'Account Owner', internal_identifier: 'account_owner')
  end
  
  def self.down
    BizTxnAcctPtyRtype.iid('account_owner').destroy
  end

end
