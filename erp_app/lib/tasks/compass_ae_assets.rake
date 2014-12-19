
namespace :compass_ae_assets do
  namespace :javascripts do
    desc "Compile CompassAe assets"
    task :precompile => :environment do
      config = Rails.application.config
      FileUtils.rm_rf(File.join(Rails.root.to_s, 'public', config.assets.prefix))

      # compile shared assets
      shared_compiler = CompassAeAssetsCompiler::Sprockets::Shared.new(uglify: true)
      shared_compiler.compile

      #compile desktop and organizer assets
      Application.where('type in (?)', ['DesktopApplication', 'OrganizerApplication']).each do |app|
        application_compiler = CompassAeAssetsCompiler::Sprockets::Application.new(app, {uglify: true})
        application_compiler.compile
      end
    end
  end
end
