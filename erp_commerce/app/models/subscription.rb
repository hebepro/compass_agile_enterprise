class Subscription < ActiveRecord::Base
  acts_as_product_instance

  class << self

    def due_to_invoice(date = Date.today)
      where('next_invoice_date = ?', date)
    end

    def due_to_charge(date = Date.today)
      where('next_charge_date = ?', date)
    end

  end

  def to_s
    "#{self.product_type.description} - $#{self.product_type.pricing_plans.first.get_price.money.amount.to_d}"
  end

  def in_trial?
    (self.trial_ends_at > Date.today)
  end

  def generate_invoice

  end

end