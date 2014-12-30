require 'nokogiri'
require 'acts-as-taggable-on'
require 'zip/zip'
require 'zip/zipfilesystem'

module Knitkit
  class Engine < Rails::Engine
    isolate_namespace Knitkit

    config.knitkit = Knitkit::Config

    initializer :assets do |config|
      Rails.application.config.assets.paths << root.join("app", "assets", "images")
      Rails.application.config.assets.precompile += %w{ knitkit-web.css knitkit/custom.css knitkit-web.js knitkit/theme.js }
      Rails.application.config.assets.precompile += %w{ erp_app/desktop/applications/knitkit/app.js }
      Rails.application.config.assets.precompile += %w{ erp_app/desktop/applications/knitkit/app.css }
    end

	  ActiveSupport.on_load(:active_record) do
      include Knitkit::Extensions::ActiveRecord::ActsAsPublishable
      include Knitkit::Extensions::ActiveRecord::ThemeSupport::HasManyThemes
      include Knitkit::Extensions::ActiveRecord::ActsAsDocument
      include Knitkit::Extensions::ActiveRecord::ActsAsCommentable
    end

    ActiveSupport.on_load(:action_controller) do
      include Knitkit::Extensions::ActionController::ThemeSupport::ActsAsThemedController
    end

    ActiveSupport.on_load(:action_mailer) do
      include Knitkit::Extensions::ActionMailer::ThemeSupport::ActsAsThemedMailer
    end

    ErpBaseErpSvcs.register_as_compass_ae_engine(config, self)
    ::ErpApp::Widgets::Loader.load_compass_ae_widgets(config, self)

  end#Engine
end#Knitkit