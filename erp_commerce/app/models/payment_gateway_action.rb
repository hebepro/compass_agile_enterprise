#### Table Definition ###########################
#  create_table :payment_gateway_actions do |t|
#
#    t.column :internal_identifier, :string
#    t.column :description,         :string
#
#    t.timestamps
#  end
#
#  add_index :payment_gateway_actions, :internal_identifier
#################################################

class PaymentGatewayAction < ActiveRecord::Base
  attr_protected :created_at, :updated_at
end
