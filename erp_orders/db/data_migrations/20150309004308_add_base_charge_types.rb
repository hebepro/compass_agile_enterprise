class AddBaseChargeTypes
  
  def self.up
    ActiveRecord::Base.transaction do
      ChargeType.create(description: 'shipping')
      ChargeType.create(description: 'tax')
      ChargeType.create(description: 'assembly')
    end
  end
  
  def self.down
    ActiveRecord::Base.transaction do
      ChargeType.find_by_description('shipping').destroy
      ChargeType.find_by_description('tax').destroy
      ChargeType.find_by_description('assembly').destroy
    end
  end

end
