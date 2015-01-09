module ErpOrders
  class Engine < Rails::Engine
    isolate_namespace ErpOrders
	  
	  ActiveSupport.on_load(:active_record) do
      include ErpOrders::Extensions::ActiveRecord::ActsAsOrderTxn
      include ErpOrders::Extensions::ActiveRecord::ActsAsOrderLineItem
    end

    ErpBaseErpSvcs.register_as_compass_ae_engine(config, self)

  end
end
