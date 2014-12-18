class CompassAeDirectiveProcessor < Sprockets::DirectiveProcessor

  def process_require_application_javascript_assets_directive(app_type, application_iid)
    app_klass = app_type == 'desktop' ? DesktopApplication : OrganizerApplication
    app = app_klass.iid(application_iid)
    app.locate_resources_with_full_path('javascripts').each do |filepath|
      context.require_asset(filepath)
    end
  end

  def process_require_application_stylesheet_assets_directive(app_type, application_iid)
    app_klass = app_type == 'desktop' ? DesktopApplication : OrganizerApplication
    app = app_klass.iid(application_iid)
    app.locate_resources_with_full_path('stylesheets').each do |filepath|
      context.require_asset(filepath)
    end
  end

  
  def process_require_shared_javascript_assets_directive
    ErpApp::ApplicationResourceLoader::SharedLoader.new.locate_shared_files(:javascripts, :full_path => true).each do |filepath|
      context.require_asset(filepath)
    end
  end

  def process_require_shared_stylesheet_assets_directive
    ErpApp::ApplicationResourceLoader::SharedLoader.new.locate_shared_files(:stylesheets, :full_path => true).each do |filepath|
      context.require_asset(filepath)
    end
  end

  
end

