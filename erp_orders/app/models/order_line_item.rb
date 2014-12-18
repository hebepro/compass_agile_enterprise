# create_table :order_line_items do |t|
#   t.column  	:order_txn_id,      		        :integer
#   t.column  	:order_line_item_type_id,       :integer
#   t.column    :product_instance_id,           :integer
#   t.column    :product_instance_description,  :string
#   t.column    :product_type_id,               :integer
#   t.column    :product_type_description,      :string
#   t.column  	:sold_price, 				            :decimal, :precision => 8, :scale => 2
#   t.column	  :sold_price_uom, 			          :integer
#   t.column  	:sold_amount, 				          :integer
#   t.column    :sold_amount_uom, 		          :integer
#   t.column    :product_offer_id,      	      :integer
#   t.column    :quantity,                      :integer
#   t.column    :unit_of_measurement_id,        :integer
#   t.timestamps
# end
#
# add_index :order_line_items, :order_txn_id
# add_index :order_line_items, :order_line_item_type_id
# add_index :order_line_items, :product_instance_id
# add_index :order_line_items, :product_type_id
# add_index :order_line_items, :product_offer_id

class OrderLineItem < ActiveRecord::Base
  attr_protected :created_at, :updated_at

	belongs_to :order_txn, :class_name => 'OrderTxn'
	belongs_to :order_line_item_type
	
  has_many :charge_lines, :as => :charged_item

  belongs_to :product_instance
  belongs_to :product_type

  has_many :order_line_item_pty_roles, :dependent => :destroy
  has_many :role_types, :through => :order_line_item_pty_roles

  ## Allow for polymorphic subtypes of this class
  belongs_to :order_line_record, :polymorphic => true

  def get_total_charges
    # get all of the charge lines associated with the order_line
    total_hash = Hash.new
    charge_lines.each do |charge|
      cur_money = charge.money
      cur_total = total_hash[cur_money.currency.internal_identifier]
      if (cur_total.nil?)
        cur_total = cur_money.clone
      else
        cur_total.amount = 0 if cur_total.amount.nil?
        cur_total.amount += cur_money.amount if !cur_money.amount.nil?
      end
      total_hash[cur_money.currency.internal_identifier] = cur_total
    end
    return total_hash.values
  end
end
