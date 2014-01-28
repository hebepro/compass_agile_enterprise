module ErpWorkEffort
  class Engine < Rails::Engine
    isolate_namespace ErpWorkEffort

    initializer "erp_work_effort.merge_public" do |app|
      app.middleware.insert_before Rack::Runtime, ::ActionDispatch::Static, "#{root}/public"
    end

    ActiveSupport.on_load(:active_record) do
      include ErpWorkEffort::Extensions::ActiveRecord::ActsAsWorkEffort
      include ErpWorkEffort::Extensions::ActiveRecord::ActsAsRoutable
      include ErpWorkEffort::Extensions::ActiveRecord::ActsAsFixedAsset
      include ErpWorkEffort::Extensions::ActiveRecord::ActsAsFacility
    end

    ErpBaseErpSvcs.register_as_compass_ae_engine(config, self)

  end
end
