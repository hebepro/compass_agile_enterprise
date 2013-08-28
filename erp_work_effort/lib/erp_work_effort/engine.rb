module ErpWorkEffort
  class Engine < Rails::Engine
    isolate_namespace ErpWorkEffort
    
    ActiveSupport.on_load(:active_record) do
      include ErpWorkEffort::Extensions::ActiveRecord::ActsAsWorkEffort
    end

    ErpBaseErpSvcs.register_as_compass_ae_engine(config, self)

  end
end
