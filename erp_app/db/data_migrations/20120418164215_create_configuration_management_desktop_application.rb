class CreateConfigurationManagementDesktopApplication
  def self.up
    app = DesktopApplication.create(
      :description => 'Configuration Management',
      :icon => 'icon-grid',
      :internal_identifier => 'configuration_management'
    )
    
    admin_user = User.find_by_username('admin')
    admin_user.desktop_applications << app
    admin_user.save
  end

  def self.down
    DesktopApplication.destroy_all(['internal_identifier = ?','configuration_management'])
  end
end
