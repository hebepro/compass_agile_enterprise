class AddSystemManagementTool

  def self.up
    #create application and assign widgets
    system_mgmt_tool = DesktopApplication.create(
        :description => 'System Management',
        :icon => 'icon-settings',
        :internal_identifier => 'system_management'
    )

    admin_user = User.find_by_username('admin')
    admin_user.desktop_applications << system_mgmt_tool
    admin_user.save
  end

  def self.down
    DesktopApplication.iid('system_management').destroy
  end

end
