module CompassAeAssetsCompiler
  module Sprockets
    class Shared < Base
      def initialize(options = {})
        super(options)
      end

      def compile
        config = Rails.application.config
        
        
        mime_type = 'application/javascript'
        
        env.unregister_processor(mime_type, ::Sprockets::DirectiveProcessor)
        env.register_processor(mime_type, ::CompassAeDirectiveProcessor)
        
        shared_loader =  ErpApp::ApplicationResourceLoader::SharedLoader.new
        shared_paths = shared_loader.locate_shared_paths('javascripts')
        
        # append the application directory path
        shared_paths.each do |shared_path|
          shared_logical_path = shared_path.gsub("#{Rails.root.to_s}/",'')
          env.append_path(shared_logical_path)
        end
        
        shared_manifest_path = shared_paths.first
        #get BundledAsset instance for the app
        asset = env.find_asset("#{shared_manifest_path}/app.js")

        # output path
        target = File.join(Rails.public_path, config.assets.prefix, 'erp_app', 'shared')
        
        # write concatatenated asset
        asset.write_to(File.join(target, asset.digest_path))
      end
      
    end #Shared
  end #Sprockets
end #CompassAeAssetsCompiler
