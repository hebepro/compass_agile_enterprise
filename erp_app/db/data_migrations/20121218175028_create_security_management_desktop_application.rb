class CreateSecurityManagementDesktopApplication
  def self.up
    app = DesktopApplication.create(
      :description => 'Security Management',
      :icon => 'icon-key',
      :internal_identifier => 'security_management',
    )
    
    admin_user = User.find_by_username('admin')
    if admin_user
      admin_user.desktop_applications << app
      admin_user.save
    end
  end

  def self.down
    DesktopApplication.destroy_all(['internal_identifier = ?','security_management'])
  end
end
