### Table Definition #####################################
#  create_table :credit_card_account_purposes do |t|
#
#    t.column  :parent_id,    :integer
#    t.column  :lft,          :integer
#    t.column  :rgt,          :integer
#
#    #custom columns go here
#
#    t.column  :description,         :string
#    t.column  :comments,            :string
#
#    t.column 	:internal_identifier, :string
#    t.column 	:external_identifier, :string
#    t.column 	:external_id_source, 	:string
#
#    t.timestamps
#  end
#
#  add_index :credit_card_account_purposes, :parent_id
#  add_index :credit_card_account_purposes, :lft
#  add_index :credit_card_account_purposes, :rgt
#########################################################

class CreditCardAccountPurpose < ActiveRecord::Base
  attr_protected :created_at, :updated_at

  acts_as_nested_set
  include ErpTechSvcs::Utils::DefaultNestedSetMethods

  has_many :credit_card_accounts
end
