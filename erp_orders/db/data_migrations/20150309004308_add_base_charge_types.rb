class AddBaseChargeTypes
  
  def self.up
    ActiveRecord::Base.transaction do
      ChargeType.create(description: 'Shipping')
      ChargeType.create(description: 'Tax')
      ChargeType.create(description: 'Assembly')
    end
  end
  
  def self.down
    ActiveRecord::Base.transaction do
      ChargeType.find_by_description('Shipping').destroy
      ChargeType.find_by_description('Tax').destroy
      ChargeType.find_by_description('Assembly').destroy
    end
  end

end
