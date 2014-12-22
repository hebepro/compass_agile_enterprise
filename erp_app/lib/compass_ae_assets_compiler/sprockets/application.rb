module CompassAeAssetsCompiler
  module Sprockets
    class Application < Base
      
      def initialize(application, options = {})
        super(options)
        @application = application
      end
      
      def compile_asset(resource_type)
        config = Rails.application.config

        if resource_type == 'javascripts'
          extension = 'js'
        elsif resource_type == 'stylesheets'
          extension = 'css'
        end

        
        app_type = (@application.type == 'DesktopApplication') ? 'desktop' : 'organizer'
        
        # append the application directory path
        app_paths = @application.locate_application_paths(resource_type)
        app_paths.each do |app_path|
          app_logical_path = app_path.gsub("#{Rails.root.to_s}/",'')
          env.append_path(app_logical_path)
        end
        
        unless app_paths.empty?
          app_manifest_path = app_paths.first

          #get BundledAsset instance for the app
          asset = env.find_asset("#{app_manifest_path}/app.#{extension}")

          # output path
          target = File.join(Rails.public_path, config.assets.prefix, 'erp_app', app_type)
          prefix, basename = asset.pathname.to_s.split('/')[-2..-1]
          
          # write concatatenated asset
          asset.write_to(File.join(target, prefix, asset.digest_path))
        end

      end

      def compile
        ['javascripts', 'stylesheets'].each do |resource_type|
          compile_asset(resource_type)
        end
      end

      
    end #Application  
  end #Sprockets
end #CompassAeAssetsCompiler
