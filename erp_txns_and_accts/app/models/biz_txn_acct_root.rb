class BizTxnAcctRoot < ActiveRecord::Base
  attr_protected :created_at, :updated_at

  belongs_to :biz_txn_acct, :polymorphic => true
  belongs_to :txn_account_type, :class_name => 'BizTxnAcctType', :foreign_key => 'biz_txn_acct_type_id'
  has_many   :biz_txn_events, :dependent => :destroy
  has_many   :biz_txn_acct_party_roles, :dependent => :destroy

  alias :account :biz_txn_acct
  alias :txn_events :biz_txn_events
  alias :txns :biz_txn_events

  def to_label
    "#{description}"
  end

  def to_s
    "#{description}"
  end

  def add_party_with_role(party, biz_txn_acct_pty_rtype, description=nil)
    biz_txn_acct_pty_rtype = BizTxnAcctPtyRtype.iid(biz_txn_acct_pty_rtype) if biz_txn_acct_pty_rtype.is_a? String
    raise "BizTxnAcctPtyRtype #{biz_txn_acct_pty_rtype.to_s} does not exist" if biz_txn_acct_pty_rtype.nil?

    # get description from biz_txn_acct_pty_rtype if not passed
    description = biz_txn_acct_pty_rtype.description unless description

    self.biz_txn_acct_party_roles << BizTxnAcctPartyRole.create(:party => party, :description => description, :biz_txn_acct_pty_rtype => biz_txn_acct_pty_rtype)
    self.save
  end

  def find_parties_by_role(biz_txn_acct_pty_rtype)
    biz_txn_acct_pty_rtype = BizTxnAcctPtyRtype.iid(biz_txn_acct_pty_rtype) if biz_txn_acct_pty_rtype.is_a? String
    raise "BizTxnAcctPtyRtype #{biz_txn_acct_pty_rtype.to_s} does not exist" if biz_txn_acct_pty_rtype.nil?
    
    Party.joins('inner join biz_txn_acct_party_roles on biz_txn_acct_party_roles.party_id = parties.id')
         .where('biz_txn_acct_pty_rtype_id = ?', biz_txn_acct_pty_rtype.id)
         .where('biz_txn_acct_root_id = ?', self.id)
  end

end
