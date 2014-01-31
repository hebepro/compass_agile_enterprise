class AddVendorConsumerProductRolesToRoleType
  
  def self.up
    product_role = RoleType.find_by_internal_identifier('vendor')
    if product_role.nil?
      RoleType.create(:description => 'Vendor', :internal_identifier => 'vendor')
    end

    product_role = RoleType.find_by_internal_identifier('consumer')
    if product_role.nil?
      RoleType.create(:description => 'Consumer', :internal_identifier => 'consumer')
    end
  end
  
  def self.down
    RoleType.find_by_internal_identifier('vendor').destroy
    RoleType.find_by_internal_identifier('consumer').destroy
  end

end
