#### Table Definition ###########################
#  create_table :financial_txns do |t|
#    t.integer :money_id
#    t.date    :apply_date
#
#    t.timestamps
#  end
#################################################

class FinancialTxn < ActiveRecord::Base
  attr_protected :created_at, :updated_at

  acts_as_biz_txn_event

  belongs_to :money, :dependent => :destroy

end
