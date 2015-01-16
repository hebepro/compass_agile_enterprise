### Table Definition ###############################
#  create_table :bank_account_types do |t|
#    t.string :description
#    t.string :internal_identifier
#
#    t.timestamps
#  end
####################################################

class BankAccountType < ActiveRecord::Base
  attr_protected :created_at, :updated_at

  has_many :bank_accounts
end
