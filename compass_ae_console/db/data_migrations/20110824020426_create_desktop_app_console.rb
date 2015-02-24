class CreateDesktopAppConsole
  def self.up
    app = DesktopApplication.create(
      :description => 'Compass Console',
      :icon => 'icon-console',
      :internal_identifier => 'compass_ae_console',
    )

    admin_user = User.find_by_username('admin')
    admin_user.desktop_applications << app
    admin_user.save
  end

  def self.down
    DesktopApplication.destroy_all(['internal_identifier = ?','compass_ae_console'])
  end
end
