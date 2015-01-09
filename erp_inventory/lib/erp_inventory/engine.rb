module ErpInventory
  class Engine < Rails::Engine
    isolate_namespace ErpInventory

    ActiveSupport.on_load(:active_record) do
      include ErpInventory::Extensions::ActiveRecord::ActsAsInventoryEntry
    end

    ErpBaseErpSvcs.register_as_compass_ae_engine(config, self)

  end
end
