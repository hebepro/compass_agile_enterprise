module ErpWorkEffort
  class Engine < Rails::Engine
    isolate_namespace ErpWorkEffort

    initializer :assets do |config|
      Rails.application.config.assets.paths << root.join("app", "assets", "images")
      Rails.application.config.assets.precompile += %w{ erp_app/desktop/applications/tasks/app.js }
    end

    ActiveSupport.on_load(:active_record) do
      include ErpWorkEffort::Extensions::ActiveRecord::ActsAsWorkEffort
      include ErpWorkEffort::Extensions::ActiveRecord::ActsAsRoutable
    end

    ErpBaseErpSvcs.register_as_compass_ae_engine(config, self)

  end
end
