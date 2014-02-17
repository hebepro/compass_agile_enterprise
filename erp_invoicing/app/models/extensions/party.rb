Party.class_eval do

  has_many :invoice_party_roles, :dependent => :destroy
  has_many :invoices, :through => :invoice_party_roles

  def billing_accounts
    BillingAccount.joins("inner join financial_txn_accounts on
                            financial_txn_accounts.financial_account_id = billing_accounts.id and
                            financial_txn_accounts.financial_account_type = 'BillingAccount'")
    .joins("inner join biz_txn_acct_roots on
                            biz_txn_acct_roots.biz_txn_acct_id = financial_txn_accounts.id and
                            biz_txn_acct_roots.biz_txn_acct_type = 'FinancialTxnAccount'")
    .joins("inner join biz_txn_acct_party_roles on
                            biz_txn_acct_party_roles.biz_txn_acct_root_id = biz_txn_acct_roots.id and
                            biz_txn_acct_party_roles.party_id = #{self.id}")
  end

  def billing_accounts_with_roles(*roles)
    billing_accounts.where('biz_txn_acct_party_roles.biz_txn_acct_pty_rtype_id' => roles)
  end

end