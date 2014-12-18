require 'action_view'

module ErpApp
  module ApplicationResourceLoader
    class SharedLoader < ErpApp::ApplicationResourceLoader::BaseLoader
      
      def locate_shared_files(resource_type, options = {})        
        options[:folder] = 'shared' if options[:folder].nil?
        options[:full_path] = false if options[:full_path].nil?
        
        with_file_path = options[:full_path]
        folder = options[:folder]

        extension = (resource_type == :javascripts) ? 'js' : 'css'

        
        engine_dirs = Rails::Application::Railties.engines.map{|p| p.config.root.to_s}
        root_and_engines_dirs = (engine_dirs | [Rails.root])

        # get shared resources (global js and css)
        shared_files = []
        root_and_engines_dirs.each do |engine_dir|
          if File.exists? File.join(engine_dir,"app/assets/#{resource_type.to_s}/erp_app", folder)
            shared_path = File.join(engine_dir,"app/assets/#{resource_type.to_s}/erp_app", folder,"**/*.#{extension}")
            paths = Dir.glob(shared_path).reject {|file| file.index("/app.#{extension}")}
            if with_file_path
              shared_files = shared_files | paths
            else
              shared_files = (shared_files | paths.collect{|path| path.gsub(File.join(engine_dir,'app/assets',resource_type.to_s,'/'),'')}).flatten

            end
          end
        end
        
        shared_files = sort_files(shared_files)
      end

      def locate_shared_paths(resource_type, folder = 'shared')
        engine_dirs = Rails::Application::Railties.engines.map{|p| p.config.root.to_s}
        root_and_engines_dirs = (engine_dirs | [Rails.root])
        
        shared_paths = []
        root_and_engines_dirs.each do |engine_dir|
          shared_path = File.join(engine_dir,"app/assets/#{resource_type.to_s}/erp_app", folder)
          if File.exists? shared_path
            if File.exists?(File.join(shared_path, 'app.js'))
              shared_paths.insert(0, shared_path)
            else
              shared_paths << shared_path
            end

          end
        end
        shared_paths
      end
      
      def locate_compiled_shared_files(resource_type, folder = 'shared')
        config = Rails.application.config
        extension = (resource_type == :javascripts) ? 'js' : 'css'
        shared_asset_path = File.join(Rails.root.to_s, 'public', config.assets.prefix, 'erp_app', folder, "**/*.#{extension}")
        Dir.glob(shared_asset_path).collect {|path| path.gsub("#{Rails.root.to_s}/public", '')}.flatten
      end


    end#SharedLoader
  end#ApplicationResourceLoader
end#ErpApp
