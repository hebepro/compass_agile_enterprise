module CompassAeAssetsCompiler
  module Sprockets
    class Shared < Base
      def initialize(options = {})
        super(options)
      end

      def compile_asset(resource_type)
        config = Rails.application.config

        if resource_type == 'javascripts'
          extension = 'js'
        elsif resource_type == 'stylesheets'
          extension = 'css'
        end
        
        
        shared_loader =  ErpApp::ApplicationResourceLoader::SharedLoader.new
        shared_paths = shared_loader.locate_shared_paths(resource_type)
        
        # append the application directory path
        shared_paths.each do |shared_path|
          shared_logical_path = shared_path.gsub("#{Rails.root.to_s}/",'')
          env.append_path(shared_logical_path)
        end

        unless shared_paths.empty?
          shared_manifest_path = shared_paths.first
          #get BundledAsset instance for the app
          asset = env.find_asset("#{shared_manifest_path}/app.#{extension}")
          
          
          # output path
          target = File.join(Rails.public_path, config.assets.prefix, 'erp_app', 'shared')
          
          # write concatatenated asset
          asset.write_to(File.join(target, asset.digest_path))
        end
        
      end

      def compile
        ['javascripts', 'stylesheets'].each do |resource_type|
          compile_asset(resource_type)
        end
      end

      
    end #Shared
  end #Sprockets
end #CompassAeAssetsCompiler
