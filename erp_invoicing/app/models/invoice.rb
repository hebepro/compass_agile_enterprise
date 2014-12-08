#### Table Definition ###########################
#  create_table :invoices do |t|
#    t.string     :invoice_number
#    t.string     :description
#    t.string     :message
#    t.date       :invoice_date
#    t.date       :due_date
#    t.string     :external_identifier
#    t.string     :external_id_source
#    t.references :product
#    t.references :invoice_type
#    t.references :billing_account
#    t.references :invoice_payment_strategy_type
#    t.references :balance
#    t.references :calculate_balance_strategy_type
#
#    t.timestamps
#  end
#################################################

class Invoice < ActiveRecord::Base
  attr_protected :created_at, :updated_at

  acts_as_document
  
  belongs_to  :billing_account
  belongs_to	:invoice_type
  belongs_to  :invoice_payment_strategy_type
  belongs_to  :balance_record, :class_name => "Money", :foreign_key => 'balance_id', :dependent => :destroy
  belongs_to  :calculate_balance_strategy_type
  has_many    :invoice_payment_term_sets, :dependent => :destroy
  has_many    :payment_applications, :as => :payment_applied_to, :dependent => :destroy do
    def successful
      all.select{|item| item.financial_txn.has_captured_payment?}
    end
    def pending
      all.select{|item| item.is_pending?}
    end
  end
  has_many 	  :invoice_items, :dependent => :destroy do
    def by_date
      order('created_at')
    end

    def unpaid
      select{|item| item.balance > 0 }
    end
  end
  has_many 	  :invoice_party_roles, :dependent => :destroy
	has_many	  :parties, :through => :invoice_party_roles
  
  alias :items :invoice_items
  alias :type :invoice_type
  alias :party_roles :invoice_party_roles
  alias :payment_strategy :invoice_payment_strategy_type

  def has_payments?(status)
    selected_payment_applications = self.get_payment_applications(status)
    !(selected_payment_applications.nil? or selected_payment_applications.empty?)
  end

  def get_payment_applications(status=:all)
    selected_payment_applications = case status.to_sym
    when :pending
      self.payment_applications.pending
    when :successful
      self.payment_applications.successful
    when :all
      self.payment_applications
    end

    unless self.items.empty?
      selected_payment_applications = (selected_payment_applications | self.items.collect{|item| item.get_payment_applications(status)}).flatten! unless (self.items.collect{|item| item.get_payment_applications(status)}.empty?)
    end
    
    selected_payment_applications
  end

  def calculate_balance
    unless self.calculate_balance_strategy_type.nil?
      case self.calculate_balance_strategy_type.internal_identifier
        when 'invoice_items_and_payments'
          (self.items.all.sum(&:total_amount) - self.total_payments)
        when 'payable_balances_and_payments'
           (self.payable_balances.all.sum(&:balance).amount - self.total_payments)
        when 'payments'
          (self.balance - self.total_payments)
        else
          self.balance
      end
    else
      self.balance
    end
  end

  def balance
    self.balance_record.amount
  end

  def balance=(amount, currency=Currency.usd)
    if self.balance_record
      self.balance_record.amount = amount
    else
      self.balance_record = Money.create(:amount => amount, :currency => currency)
    end
    self.balance_record.save
  end

  def payment_due
    self.items.all.sum(&:total_amount)
  end

  def total_payments
    self.get_payment_applications(:successful).sum{|item| item.money.amount}
  end

  def transactions
    transactions = []

    self.items.each do |item|
      transactions << {
        :date => item.created_at,
        :description => item.item_description,
        :quantity => item.quantity,
        :amount => item.amount
      }
    end

    self.get_payment_applications(:successful).each do |item|
      transactions << {
        :date => item.financial_txn.payments.last.created_at,
        :description => item.financial_txn.description,
        :quantity => 1,
        :amount => (0 - item.financial_txn.money.amount)
      }
    end

    transactions.sort_by{|item| [item[:date]]}
  end

  def add_party_with_role_type(party, role_type)
    self.invoice_party_roles << InvoicePartyRole.create(:party => party, :role_type => convert_role_type(role_type))
    self.save
  end

  def find_parties_by_role_type(role_type)
    self.invoice_party_roles.where('role_type_id = ?', convert_role_type(role_type).id).all.collect(&:party)
  end

  private

  def convert_role_type(role_type)
    role_type = RoleType.iid(role_type) if role_type.is_a? String
    raise "Role type does not exist" if role_type.nil?

    role_type
  end
	
end
