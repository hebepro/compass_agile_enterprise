module RailsDbAdmin
  class Engine < Rails::Engine
    isolate_namespace RailsDbAdmin

    config.rails_db_admin = RailsDbAdmin::Config

    ErpBaseErpSvcs.register_as_compass_ae_engine(config, self)
    ::ErpApp::Widgets::Loader.load_compass_ae_widgets(config, self)
    
  end
end
