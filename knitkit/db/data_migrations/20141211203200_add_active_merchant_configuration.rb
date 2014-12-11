class AddActiveMerchantConfiguration

  def self.up
    #configuration
    configuration = Configuration.find_template('default_website_configuration')
    active_merchant_category = Category.create(:description => 'Active Merchant', :internal_identifier => 'active_merchant')

    brain_tree_option = ConfigurationOption.create(
        :description => 'BrainTree',
        :internal_identifier => 'brain_tree',
        :value => 'BrainTreeGatewayWrapper'
    )

    authorize_net_option = ConfigurationOption.create(
        :description => 'Authorize.net',
        :internal_identifier => 'authorize_net',
        :value => 'AuthorizeNetWrapper'
    )

    stripe_option = ConfigurationOption.create(
        :description => 'Stripe',
        :internal_identifier => 'stripe',
        :value => 'StripeWrapper'
    )

    active_merchant_gateway_config_item_type = ConfigurationItemType.create(
        :description => 'Active Merchant Gateway',
        :internal_identifier => 'active_merchant_gateway'
    )

    active_merchant_gateway_config_item_type.configuration_options << brain_tree_option
    active_merchant_gateway_config_item_type.configuration_options << authorize_net_option
    active_merchant_gateway_config_item_type.add_default_option(stripe_option)
    CategoryClassification.create(:category => active_merchant_category, :classification => active_merchant_gateway_config_item_type)

    public_key_config_item_type = ConfigurationItemType.create(
        :description => 'Public Key',
        :internal_identifier => 'public_key',
        :allow_user_defined_options => true
    )
    CategoryClassification.create(:category => active_merchant_category, :classification => public_key_config_item_type)

    private_key_config_item_type = ConfigurationItemType.create(
        :description => 'Private Key',
        :internal_identifier => 'private_key',
        :allow_user_defined_options => true
    )
    CategoryClassification.create(:category => active_merchant_category, :classification => private_key_config_item_type)

    configuration.configuration_item_types << public_key_config_item_type
    configuration.configuration_item_types << private_key_config_item_type
    configuration.configuration_item_types << active_merchant_gateway_config_item_type

    configuration.save

    Website.all.each do |website|
      configuration = website.configurations.first
      configuration.configuration_item_types << public_key_config_item_type
      configuration.configuration_item_types << private_key_config_item_type
      configuration.configuration_item_types << active_merchant_gateway_config_item_type

      configuration.add_configuration_item(active_merchant_gateway_config_item_type)
      configuration.add_configuration_item(private_key_config_item_type)
      configuration.add_configuration_item(public_key_config_item_type)
    end

  end

  def self.down
    #remove data here
  end

end


