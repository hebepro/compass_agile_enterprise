### Table Definition ###############################
#  create_table :accepted_credit_cards do |t|
#
#    t.references :organization
#    t.string :card_type
#
#    t.timestamps
#  end
###################################################

class AcceptedCreditCard < ActiveRecord::Base
  attr_protected :created_at, :updated_at

  belongs_to :organization
end
