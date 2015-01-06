# create_table :order_line_items do |t|
#   t.integer  	  :order_txn_id
#   t.integer  	  :order_line_item_type_id
#   t.integer     :product_offer_id
#   t.string      :product_offer_description
#   t.integer     :product_instance_id,
#   t.string      :product_instance_description
#   t.integer     :product_type_id
#   t.string      :product_type_description
#   t.decimal  	  :sold_price, :precision => 8, :scale => 2
#   t.integer	    :sold_price_uom
#   t.integer  	  :sold_amount
#   t.integer     :sold_amount_uom
#   t.integer     :quantity
#   t.integer     :unit_of_measurement_id
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
  belongs_to :product_offer

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

    total_hash.values
  end

  # Alias for to_s
  def to_label
    to_s
  end

  # The description is pulled from the first descriptive record it finds trying
  # product_offer then product_instance and lastly product_type
  def to_s
    description = ""

    if product_offer_description.blank?
      if product_instance_description.blank?
        description = product_type_description
      else
        description =  product_instance_description
      end
    else
      description = product_offer_description
    end

    description
  end
end
