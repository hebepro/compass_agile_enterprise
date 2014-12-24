require 'action_view'

module ErpApp
  module ApplicationResourceLoader
    class DesktopOrganizerLoader < ErpApp::ApplicationResourceLoader::BaseLoader
      def initialize(application)
        @application = application
        @app_name = @application.internal_identifier
        @app_type = (@application.type == 'DesktopApplication') ? 'desktop' : 'organizer'

      end

      def locate_resources(resource_type, options = {})        
        locate_resource_files(resource_type, options)
      end

      def locate_application_paths(resource_type)
        engine_dirs = Rails::Application::Railties.engines.map{|p| p.config.root.to_s}
        root_and_engines_dirs = (engine_dirs | [Rails.root])
        application_paths = []
        engine_dirs.each do |engine_dir|
          file_path = File.join(engine_dir,"app/assets/#{resource_type}/erp_app/#{@app_type}/applications",@app_name)
          if File.exists? file_path
            # if the path as the manifest push it in front 
            if File.exists?(File.join(file_path, 'app.js'))
              application_paths.insert(0, file_path)
            else
              application_paths << file_path
            end
          end
        end
        root_and_engines_dirs.each do |engine_dir|
          app_extension_path = File.join(engine_dir,"app/assets/#{resource_type}/extensions/compass_ae/erp_app/#{@app_type}/applications",@app_name)
          if File.exists? app_extension_path
            application_paths << app_extension_path
          end
        end
        
        application_paths
      end
      
      private

      def locate_resource_files(resource_type, options)
        options[:full_path] = false if options[:full_path].nil?
        with_file_path = options[:full_path]

        engine_dirs = Rails::Application::Railties.engines.map{|p| p.config.root.to_s}
        root_and_engines_dirs = (engine_dirs | [Rails.root])

        extension = (resource_type == 'javascripts') ? 'js' : 'css'
        
        application_files = []
        root_and_engines_dirs.each do |engine_dir|
          #get all files based on resource type we are loading for the
          #given application type andapplication
          if File.exists? File.join(engine_dir,"app/assets/#{resource_type}/erp_app/#{@app_type}/applications",@app_name)
            application_path = File.join(engine_dir,"app/assets/#{resource_type}/erp_app/#{@app_type}/applications",@app_name)
            search_path = File.join(application_path,"**/*.#{extension}")
            app_files = Dir.glob(search_path).reject {|file| file.index("/app.#{extension}")}
            if with_file_path
              application_files = application_files | app_files
            else
              application_files = application_files | app_files.collect{|path| path.gsub(application_path,'')}
            end
            
          end
 
        end
        application_files = sort_files(application_files)

        #make sure the base js file is loaded before all others
        if resource_type == 'javascripts' && (application_files.index{|x| x =~ /module.js/} || application_files.index{|x| x =~ /base.js/})
          index = (@app_type == 'desktop') ? application_files.index{|x| x =~ /module.js/} : application_files.index{|x| x =~ /base.js/}
          first_load_js = application_files[index]
          application_files.delete_at(index)
          application_files.unshift(first_load_js)
        end
        application_files.map!{|file| File.join("erp_app/#{@app_type}/applications/#{@app_name}",file)} unless with_file_path

        #get any extensions from other engines
        engine_extension_files = []
        engine_dirs.each do |engine_dir|
          application_path = File.join(engine_dir,"app/assets/#{resource_type}/extensions/compass_ae/erp_app/#{@app_type}/applications",@app_name)
          
          #get all files based on resource type we are loading for the given application type and application
          if File.exists? File.join(engine_dir,"app/assets/#{resource_type}/extensions/compass_ae/erp_app/#{@app_type}/applications",@app_name)
            application_path = File.join(engine_dir,"app/assets/#{resource_type}/extensions/compass_ae/erp_app/#{@app_type}/applications",@app_name)
            search_path = File.join(application_path,"**/*.#{extension}")
            app_files = Dir.glob(search_path).reject {|file| file.index("/app.#{extension}")}
            if with_file_path
              engine_extension_files = engine_extension_files | app_files
            else
              engine_extension_files = engine_extension_files | app_files.collect{|path| path.gsub(application_path,'')}

            end
          end
        end
        engine_extension_files = sort_files(engine_extension_files.collect{|file| File.basename(file)})
        engine_extension_files.map!{|file| File.join("extensions/compass_ae/erp_app/#{@app_type}/applications/#{@app_name}",file)} unless with_file_path

        #get any extension from root rails app
        root_extension_files = []
        if File.exists? File.join(Rails.root,"app/assets/#{resource_type}/extensions/compass_ae/erp_app", @app_type, 'applications', @app_name)
          application_path = File.join(Rails.root,"app/assets/#{resource_type}/extensions/compass_ae/erp_app", @app_type, 'applications', @app_name)
          search_path = File.join(application_path,"**/*.#{extension}")
          app_files = Dir.glob(search_path).reject {|file| file.index("/app.#{extension}")}
          if with_file_path
            root_extension_files = root_extension_files | app_files
          else
            root_extension_files = root_extension_files | app_files.collect{|path| path.gsub(application_path,'')}
          end
        end
        root_extension_files = sort_files(root_extension_files.collect{|file| File.basename(file)})
        root_extension_files.map!{|file| File.join("extensions/compass_ae/erp_app/#{@app_type}/applications/#{@app_name}",file)} unless with_file_path
        
        (application_files + engine_extension_files + root_extension_files)
      end
      
    end#DesktopOrganizerLoader
  end#ApplicationResourceLoader
end#ErpApp
