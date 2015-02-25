class SetupCompassAeInstance
  
  def self.up
    # setup currency
    Currency.create(:name => 'US Dollar', :internal_identifier => 'USD', :major_unit_symbol => "$")

    # setup iso codes
    #find the erp_base_erp_svcs engine
    engine_path = Rails::Application::Railties.engines.find{|item| item.engine_name == 'erp_base_erp_svcs'}.config.root.to_s

    GeoCountry.load_from_file(File.join(engine_path,'db/data_sets/geo_countries.yml'))
    GeoZone.load_from_file(File.join(engine_path,'db/data_sets/geo_zones.yml'))

    # setup instance
    instance = CompassAeInstance.new
    instance.description = 'Base CompassAE Instance'
    instance.internal_identifier = 'base'
    instance.version = '3.1'
    instance.save

    instance.setup_guid

    role_type = RoleType.new
    role_type.description = 'CompassAE Instance Owner'
    role_type.internal_identifier = 'compass_ae_instance_owner'
    role_type.save
  end
  
  def self.down
    #remove data here
  end

end
