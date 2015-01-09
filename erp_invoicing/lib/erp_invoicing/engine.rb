module ErpInvoicing
  class Engine < Rails::Engine
    isolate_namespace ErpInvoicing

    ActiveSupport.on_load(:active_record) do
      include ErpInvoicing::Extensions::ActiveRecord::HasPaymentApplications
    end

    ErpBaseErpSvcs.register_as_compass_ae_engine(config, self)
    ::ErpApp::Widgets::Loader.load_compass_ae_widgets(config, self)

  end
end
