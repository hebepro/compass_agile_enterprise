# create_table :order_txns do |t|
#   t.column    :state_machine,   		:string
#   t.column    :description,     		:string
#   t.column		:order_txn_type_id, 	:integer
#
#   # Multi-table inheritance info
#   t.column    :order_txn_record_id,   :integer
#   t.column    :order_txn_record_type, :string
#
#   # Contact Information
#   t.column 		:email,              :string
#   t.column 		:phone_number,       :string
#
#   # Shipping Address
#   t.column 		:ship_to_first_name,     :string
#   t.column 		:ship_to_last_name,      :string
#   t.column 		:ship_to_address_line_1, :string
#   t.column 		:ship_to_address_line_2, :string
#   t.column 		:ship_to_city,           :string
#   t.column    :ship_to_state,          :string
#   t.column 		:ship_to_postal_code,    :string
#   t.column 		:ship_to_country,        :string
#
#   # Billing Address
#   t.column 		:bill_to_first_name,     :string
#   t.column 		:bill_to_last_name,      :string
#   t.column 		:bill_to_address_line_1, :string
#   t.column 		:bill_to_address_line_2, :string
#   t.column 		:bill_to_city,           :string
#   t.column    :bill_to_state,          :string
#   t.column 		:bill_to_postal_code,    :string
#   t.column 		:bill_to_country,        :string
#
#   # Private parts
#   t.column 		:customer_ip, 			    :string
#   t.column    :order_number,          :integer
#   t.column 		:status,                :string
#   t.column 		:error_message, 		    :string
#
#   t.timestamps
# end
#
# add_index :order_txns, :order_txn_type_id
# add_index :order_txns, [:order_txn_record_id, :order_txn_record_type], :name => 'order_txn_record_idx'
#
# add_index :order_txns, :order_txn_type_id
# add_index :order_txns, [:order_txn_record_id, :order_txn_record_type], :name => 'order_txn_record_idx'

OrderTxn.class_eval do
  acts_as_priceable
end
