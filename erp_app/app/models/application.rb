class Application < ActiveRecord::Base
  attr_protected :created_at, :updated_at

  has_user_preferences

  has_and_belongs_to_many :app_containers
  has_and_belongs_to_many :widgets

  validates_uniqueness_of :javascript_class_name, :allow_nil => true
  validates_uniqueness_of :internal_identifier, :scope => :type, :case_sensitive => false

  class << self
    def iid(internal_identifier)
      find_by_internal_identifier(internal_identifier)
    end

    def locate_application_compiled_resources(resource_type)
      config = Rails.application.config
      extension = (resource_type == 'javascripts') ? 'js' : 'css'
      assets_path = File.join(Rails.root.to_s, 'public', config.assets.prefix, 'erp_app', "**/*.#{extension}")
      application_files = Dir.glob(assets_path)
    end
  end

  def locate_resources(resource_type)
    resource_loader = ErpApp::ApplicationResourceLoader::DesktopOrganizerLoader.new(self)
    resource_loader.locate_resources(resource_type)
  end

  def locate_resources_with_full_path(resource_type)
    resource_loader = ErpApp::ApplicationResourceLoader::DesktopOrganizerLoader.new(self)
    resource_loader.locate_resources(resource_type, {full_path: true})
  end

  def locate_application_paths(resource_type)
    resource_loader = ErpApp::ApplicationResourceLoader::DesktopOrganizerLoader.new(self)
    resource_loader.locate_application_paths(resource_type)
  end



end
