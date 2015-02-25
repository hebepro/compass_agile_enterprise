class CreateWebsiteDefaultConfiguration
  
  def self.up
    unless ::Configuration.find_template('default_website_configuration')
      website_setup_category = Category.create(:description => 'Website Setup', :internal_identifier => 'website_setup')
      content_work_flow_category = Category.create(:description => 'Content Workflow', :internal_identifier => 'content_workflow')

      yes_option = ConfigurationOption.find_by_internal_identifier('yes')
      yes_option = ConfigurationOption.create(
          :description => 'Yes',
          :internal_identifier => 'yes',
          :value => 'yes'
      ) if yes_option.nil?

      no_option = ConfigurationOption.find_by_internal_identifier('no')
      no_option = ConfigurationOption.create(
          :description => 'No',
          :internal_identifier => 'no',
          :value => 'no'
      ) if no_option.nil?

      #configuration
      configuration = Configuration.create(
        :description => 'Default Website Configuration',
        :internal_identifier => 'default_website_configuration',
        :is_template => true
      )

      # login url
      login_url_config_item_type = ConfigurationItemType.create(
        :description => 'Login Url',
        :internal_identifier => 'login_url',
        :allow_user_defined_options => true
      )
      CategoryClassification.create(:category => website_setup_category, :classification => login_url_config_item_type)
      configuration.configuration_item_types << login_url_config_item_type

      # primary host
      primary_host_config_item_type = ConfigurationItemType.create(
          :description => 'Primary Host',
          :internal_identifier => 'primary_host',
          :allow_user_defined_options => true
      )
      CategoryClassification.create(:category => website_setup_category, :classification => primary_host_config_item_type)
      configuration.configuration_item_types << primary_host_config_item_type

      # homepage url
      home_page_url_config_item_type = ConfigurationItemType.create(
        :description => 'Homepage Url',
        :internal_identifier => 'homepage_url',
        :allow_user_defined_options => true
      )
      CategoryClassification.create(:category => website_setup_category, :classification => home_page_url_config_item_type)
      configuration.configuration_item_types << home_page_url_config_item_type

      # contact us email
      contact_us_email_address_item_type = ConfigurationItemType.create(
        :description => 'Contact Us Email',
        :internal_identifier => 'contact_us_email_address',
        :allow_user_defined_options => true
      )
      CategoryClassification.create(:category => website_setup_category, :classification => contact_us_email_address_item_type)
      configuration.configuration_item_types << contact_us_email_address_item_type

      #add email inquiries config
      email_inquiries_config_item_type = ConfigurationItemType.create(
          :description => 'Email inquiries',
          :internal_identifier => 'email_inquiries'
      )
      email_inquiries_config_item_type.configuration_options << yes_option
      email_inquiries_config_item_type.add_default_option(no_option)
      CategoryClassification.create(:category => website_setup_category, :classification => email_inquiries_config_item_type)

      configuration.configuration_item_types << email_inquiries_config_item_type

      #add auto activate publications
      auto_activate_config_item_type = ConfigurationItemType.create(
          :description => 'Auto activate publications',
          :internal_identifier => 'auto_active_publications'
      )
      auto_activate_config_item_type.configuration_options << no_option
      auto_activate_config_item_type.add_default_option(yes_option)
      CategoryClassification.create(:category => content_work_flow_category, :classification => auto_activate_config_item_type)

      configuration.configuration_item_types << auto_activate_config_item_type

      #add auto publish on save
      publish_on_save_config_item_type = ConfigurationItemType.create(
          :description => 'Publish on save',
          :internal_identifier => 'publish_on_save'
      )
      publish_on_save_config_item_type.configuration_options << no_option
      publish_on_save_config_item_type.add_default_option(yes_option)
      CategoryClassification.create(:category => content_work_flow_category, :classification => publish_on_save_config_item_type)

      configuration.configuration_item_types << publish_on_save_config_item_type

      #password strength
      simple_password_option = ConfigurationOption.create(
        :description => 'Simple password',
        :comment => 'must be between 8 and 20 characters with no spaces',
        :internal_identifier => 'simple_password_regex',
        :value => '^\S{8,20}$'
      )

      complex_password_option = ConfigurationOption.create(
        :description => 'Complex password',
        :comment => 'must be at least 10 characters, must contain at least one lower case letter, one upper case letter, one digit and one special character, valid special characters are @#$%^&+=',
        :internal_identifier => 'complex_password_regex',
        :value => '^.*(?=.{10,})(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).*$'
      )

      password_strength_config_item_type = ConfigurationItemType.create(
        :description => 'Password Strength',
        :internal_identifier => 'password_strength_regex'
      )
      CategoryClassification.create(:category => website_setup_category, :classification => password_strength_config_item_type)

      password_strength_config_item_type.configuration_options << complex_password_option
      password_strength_config_item_type.add_default_configuration_option(simple_password_option)
      password_strength_config_item_type.save
      configuration.configuration_item_types << password_strength_config_item_type

      configuration.save
    end
  end
  
  def self.down
    #remove data here
  end

end
