### Table Definition #####################################
#  create_table :credit_card_account_party_roles do |t|
#    t.column :credit_card_account_id, :integer
#    t.column :role_type_id,           :integer
#    t.column :party_id,               :integer
#    t.column :credit_card_id,         :integer
#
#    t.timestamps
#  end
#
#  add_index :credit_card_account_party_roles, :credit_card_account_id
#  add_index :credit_card_account_party_roles, :role_type_id
#  add_index :credit_card_account_party_roles, :party_id
#  add_index :credit_card_account_party_roles, :credit_card_id
#
##########################################################

class CreditCardAccountPartyRole < ActiveRecord::Base
  attr_protected :created_at, :updated_at

  belongs_to :credit_card_account
  belongs_to :role_type
  belongs_to :party
  belongs_to :credit_card
end