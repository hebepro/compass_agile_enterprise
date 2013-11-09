class AddCustomerEmployeeReln

  def self.up
    from_role = RoleType.find_by_internal_identifier('employee')
    if from_role.nil?
      from_role = RoleType.create(:description => 'Employee', :internal_identifier => 'employee')
    end

    to_role = RoleType.find_by_internal_identifier('customer')
    if to_role.nil?
      to_role = RoleType.create(:description => 'Customer', :internal_identifier => 'customer')
    end

    RelationshipType.create(:description => 'Employees Of Customer',
                            :name => 'Employee Of Customer',
                            :internal_identifier => 'employee_customer',
                            :valid_from_role => from_role,
                            :valid_to_role => to_role
    )
  end

  def self.down
    #remove data here
  end

end
