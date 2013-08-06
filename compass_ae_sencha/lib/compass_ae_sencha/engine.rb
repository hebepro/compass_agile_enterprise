module CompassAeSencha
  class Engine < Rails::Engine
    isolate_namespace CompassAeSencha

    initializer "compass_ae_sencha_assets.merge_public" do |app|
      app.middleware.insert_before Rack::Runtime, ::ActionDispatch::Static, "#{root}/public"
    end

  end
end
