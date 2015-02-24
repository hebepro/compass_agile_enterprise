class ErpAppSetup

  def self.up
    if(ContactPurpose.find_by_internal_identifier('default').nil?)

      #######################################
      #contact purposes
      #######################################
      [
          {:description => 'Default', :internal_identifier => 'default'},
          {:description => 'Home', :internal_identifier => 'home'},
          {:description => 'Work', :internal_identifier => 'work'},
          {:description => 'Billing', :internal_identifier => 'billing'},
          {:description => 'Temporary', :internal_identifier => 'temporary'},
          {:description => 'Tax Reporting', :internal_identifier => 'tax_reporting'},
          {:description => 'Recruiting', :internal_identifier => 'recruiting'},
          {:description => 'Employment Offer', :internal_identifier => 'employment_offer'},
          {:description => 'Business', :internal_identifier => 'business'},
          {:description => 'Personal', :internal_identifier => 'personal'},
          {:description => 'Fax', :internal_identifier => 'fax'},
          {:description => 'Mobile', :internal_identifier => 'mobile'},
          {:description => 'Emergency', :internal_identifier => 'emergency'},
          {:description => 'Shipping', :internal_identifier => 'shipping'},
          {:description => 'Other', :internal_identifier => 'other'},
      ].each do |item|
        contact_purpose = ContactPurpose.find_by_internal_identifier(item[:internal_identifier])
        ContactPurpose.create(:description => item[:description], :internal_identifier => item[:internal_identifier]) if contact_purpose.nil?
      end

      #######################################
      #roles
      #######################################
      SecurityRole.create(:description => 'Admin', :internal_identifier => 'admin')
      SecurityRole.create(:description => 'Employee', :internal_identifier => 'employee')
    
      #######################################
      #desktop setup
      #######################################

      #create preference options
      #yes no options
      PreferenceOption.create(:description => 'Yes', :internal_identifier => 'yes', :value => 'yes')
      PreferenceOption.create(:description => 'No', :internal_identifier => 'no', :value => 'no')

      #create application and assign widgets
      user_mgr_app = DesktopApplication.create(
          :description => 'User Management',
          :icon => 'icon-user',
          :internal_identifier => 'user_management'
      )

      #######################################
      #organizer setup
      #######################################

      #create application
      crm_app = Application.create(
          :description => 'CRM',
          :icon => 'icon-user',
          :internal_identifier => 'crm'
      )

      #######################################
      #parties
      #######################################

      #Admins
      Individual.create(:current_first_name => 'Admin',:current_last_name => 'Istrator',:gender => 'm')

      #Organization
      Organization.create(:description => 'TrueNorth')

      #######################################
      #users
      #######################################
      admin_individual = Individual.where('current_first_name = ?',"Admin").first
      admin_user = User.create(
          :username => "admin",
          :email => "admin@portablemind.com"
      )
      admin_user.password = 'password'
      admin_user.password_confirmation = 'password'
      admin_user.party = admin_individual.party
      admin_user.activate!
      admin_user.save
      admin_user.add_role('admin')
      admin_user.save

      admin_user.apps << crm_app
      admin_user.desktop_applications << user_mgr_app
      admin_user.save
    end
  end

  def self.down
    #remove data here
  end

end
