### Table Definition ###############################
#  create_table :payment_gateways do |t|
#
#    t.column :params,                      :string
#    t.column :payment_gateway_action_id,   :integer
#    t.column :payment_id,   :integer
#    t.column :response,                    :string
#
#    t.timestamps
#  end
####################################################

class PaymentGateway < ActiveRecord::Base
  attr_protected :created_at, :updated_at

  belongs_to :payment_gateway_action
  belongs_to :payment
end
