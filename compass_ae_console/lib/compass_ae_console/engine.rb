module CompassAeConsole
  class Engine < Rails::Engine
    isolate_namespace CompassAeConsole

    initializer :assets do |config|
      Rails.application.config.assets.paths << root.join("app", "assets", "images")
      Rails.application.config.assets.precompile += %w{ erp_app/desktop/applications/compass_ae_console/app.js }
      Rails.application.config.assets.precompile += %w{ erp_app/desktop/applications/compass_ae_console/app.css }
      Rails.application.config.assets.precompile += %w{ erp_app/shared/console_panel.js }
    end

    ErpBaseErpSvcs.register_as_compass_ae_engine(config, self)
  end
end
