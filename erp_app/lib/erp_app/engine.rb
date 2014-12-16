require 'will_paginate'

module ErpApp
  class Engine < Rails::Engine
    isolate_namespace ErpApp

    Mime::Type.register "tree", :tree

    config.erp_app = ErpApp::Config

    
    ActiveSupport.on_load(:active_record) do
      include ErpApp::Extensions::ActiveRecord::HasUserPreferences
    end
	  
    ActiveSupport.on_load(:action_controller) do
      include ActiveExt
    end
      
    #add observers
    #this is ugly need a better way
    (config.active_record.observers.nil?) ? config.active_record.observers = [:user_app_container_observer] : config.active_record.observers << :user_app_container_observer
    
    ErpBaseErpSvcs.register_as_compass_ae_engine(config, self)
    ::ErpApp::Widgets::Loader.load_root_widgets(config)

  end
end
