class AddIidToChargeType

  def self.up
    shipping = ChargeType.find_by_description('shipping')
    if shipping
      shipping.description = "Shipping"
      shipping.internal_identifier = 'shipping'
    end

    assembly = ChargeType.find_by_description('assembly')
    if assembly
      assembly.description = "Assembly"
      assembly.internal_identifier = 'assembly'
    end
  end

  def self.down
    #remove data here
  end

end
