require 'will_paginate'

module ErpApp
  class Engine < Rails::Engine
    isolate_namespace ErpApp

    Mime::Type.register "tree", :tree

    config.erp_app = ErpApp::Config

    initializer "knikit.merge_public" do |app|
      app.middleware.insert_before Rack::Runtime, ::ActionDispatch::Static, "#{root}/public"
    end

    initializer :assets do |config|
      Rails.application.config.assets.paths << root.join("app", "assets", "images")

      # include css files
      Rails.application.config.assets.precompile += %w{ erp_app/shared/app.css erp_app/shared/compass-ext-all.css jquery_plugins/jquery.loadmask.css }
      Rails.application.config.assets.precompile += %w{ erp_app/login/main.css erp_app/desktop/base.css erp_app/organizer/base.css }
      Rails.application.config.assets.precompile += %w{ erp_app/desktop/applications/security_management/app.css }

      # include organizer applications
      Rails.application.config.assets.precompile += %w{ erp_app/organizer/applications/crm/app.css }

      # include js files
      Rails.application.config.assets.precompile += %w{ jquery_plugins/jquery.address.min.js jquery_plugins/jquery.loadmask.min.js }
      Rails.application.config.assets.precompile += %w{ erp_app/jquery_support.js erp_app/utility.js erp_app/widgets.js }
      Rails.application.config.assets.precompile += %w{ erp_app/shared/app.js }
      Rails.application.config.assets.precompile += %w{ erp_app/authentication/compass_user.js }
      Rails.application.config.assets.precompile += %w{ erp_app/ecommerce/credit_card_window.js }
      Rails.application.config.assets.precompile += %w{ erp_app/login/mobile.js erp_app/login/window.js }
      Rails.application.config.assets.precompile += %w{ erp_app/organizer/app.js }
      Rails.application.config.assets.precompile += %w{ erp_app/desktop/app.js }
      Rails.application.config.assets.precompile += %w{ erp_app/mobile/app.js }
      Rails.application.config.assets.precompile += %w{ erp_app/mobile/app.css }

      # include desktop applications

      # javascript
      Rails.application.config.assets.precompile += %w{ erp_app/desktop/applications/audit_log_viewer/app.js }
      Rails.application.config.assets.precompile += %w{ erp_app/desktop/applications/configuration_management/app.js }
      Rails.application.config.assets.precompile += %w{ erp_app/desktop/applications/control_panel/app.js }
      Rails.application.config.assets.precompile += %w{ erp_app/desktop/applications/file_manager/app.js }
      Rails.application.config.assets.precompile += %w{ erp_app/desktop/applications/job_tracker/app.js }
      Rails.application.config.assets.precompile += %w{ erp_app/desktop/applications/scaffold/app.js }
      Rails.application.config.assets.precompile += %w{ erp_app/desktop/applications/security_management/app.js }
      Rails.application.config.assets.precompile += %w{ erp_app/desktop/applications/tail/app.js }
      Rails.application.config.assets.precompile += %w{ erp_app/desktop/applications/user_management/app.js }
      Rails.application.config.assets.precompile += %w{ erp_app/desktop/applications/web_navigator/app.js }

      # css
      Rails.application.config.assets.precompile += %w{ erp_app/desktop/applications/audit_log_viewer/app.css }
      Rails.application.config.assets.precompile += %w{ erp_app/desktop/applications/configuration_management/app.css }
      Rails.application.config.assets.precompile += %w{ erp_app/desktop/applications/control_panel/app.css }
      Rails.application.config.assets.precompile += %w{ erp_app/desktop/applications/file_manager/app.css }
      Rails.application.config.assets.precompile += %w{ erp_app/desktop/applications/job_tracker/app.css }
      Rails.application.config.assets.precompile += %w{ erp_app/desktop/applications/scaffold/app.css }
      Rails.application.config.assets.precompile += %w{ erp_app/desktop/applications/security_management/app.css }
      Rails.application.config.assets.precompile += %w{ erp_app/desktop/applications/tail/app.css }
      Rails.application.config.assets.precompile += %w{ erp_app/desktop/applications/user_management/app.css }
      Rails.application.config.assets.precompile += %w{ erp_app/desktop/applications/web_navigator/app.css }

      # include organizer applications

      # javascript
      Rails.application.config.assets.precompile += %w{ erp_app/organizer/applications/crm/app.js }

      # include mobile applications

      # javascript
      Rails.application.config.assets.precompile += %w{ erp_app/mobile/applications/job_tracker/app.js }
      Rails.application.config.assets.precompile += %w{ erp_app/mobile/applications/user_management/app.js }

      # css
      Rails.application.config.assets.precompile += %w{ erp_app/mobile/applications/job_tracker/app.css }
      Rails.application.config.assets.precompile += %w{ erp_app/mobile/applications/user_management/app.css }

      # add shared assets to included by Compass
      ErpApp::Config.shared_js_assets += %w{ erp_app/shared/erp_app_shared.js }
      ErpApp::Config.shared_css_assets += %w{ erp_app/shared/erp_app_shared.css erp_app/shared/compass-ext-all.css }
    end

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
