module CompassAeAssetsCompiler
  module Sprockets
    class Image < Base

      def compile
        engine_dirs = Rails::Application::Railties.engines.map{|p| p.config.root.to_s}
        root_and_engines_dirs = (engine_dirs | [Rails.root])

        config = Rails.application.config
        target = File.join(Rails.public_path, config.assets.prefix) 
        root_and_engines_dirs.each do |engine_dir|
          images_path = File.join(engine_dir, 'app', 'assets', 'images')
          env.append_path(images_path.gsub("#{Rails.root.to_s}/",''))
          Dir.glob(File.join(images_path, '**/*.*')).each do |image_path|
            asset = env.find_asset(image_path)
            file_path = asset.pathname.to_s.split('app/assets/images/').last
            asset.write_to(File.join(target, file_path))
          end
        end

        
      end
      
    end #Image
  end #Sprockets
end #CompassAeAssetsCompiler
