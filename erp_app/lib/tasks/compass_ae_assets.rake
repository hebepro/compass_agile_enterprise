namespace :compass_ae_assets do
  namespace :javascripts do
    desc "Compile CompassAe assets"
    task :precompile => :environment do
      config = Rails.application.config
      Application.where('type in (?)', ['DesktopApplication', 'OrganizerApplication']).each do |app|
        env = Sprockets::Environment.new(Rails.root)
        app_type = (app.type == 'DesktopApplication') ? 'desktop' : 'organizer'
        
        # append the application directory path
        app_path = app.locate_application_paths('javascripts').first.gsub("#{Rails.root.to_s}/",'')
        env.append_path(app_path)
        
        #get BundledAsset instance for the app
        asset = env.find_asset("#{Rails.root.to_s}/#{app_path}/app.js")
        
        # output path
        target = File.join(Rails.public_path, config.assets.prefix, 'erp_app', app_type)
        prefix, basename = asset.pathname.to_s.split('/')[-2..-1]
        
        # write concatatenated asset
        asset.write_to(File.join(target, prefix, basename))

      end
    end
  end
end
