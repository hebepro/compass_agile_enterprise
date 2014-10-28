if Rails.application.config.cache_classes
  Rails.application.config.after_initialize do
    ErpBaseErpSvcs.load_root_compass_ae_framework_extensions
  end
else
  Rails.application.config.to_prepare do
    ErpBaseErpSvcs.load_root_compass_ae_framework_extensions
  end
end