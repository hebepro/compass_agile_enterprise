class ProductOffer < ActiveRecord::Base
  attr_protected :created_at, :updated_at

  DATE_FORMAT = "%m/%d/%Y"

  belongs_to :product_offer_record, :polymorphic => true

  def valid_from=(date)
    if date.is_a? String
      write_attribute(:valid_from, Date.strptime(date, DATE_FORMAT))
    else
      super
    end
  end

  def valid_to=(date)
    if date.is_a? String
      write_attribute(:valid_to, Date.strptime(date, DATE_FORMAT))
    else
      super
    end
  end

  def after_destroy
    if self.product_offer_record && !self.product_offer_record.frozen?
      self.product_offer_record.destroy
    end 
  end	
  
end
