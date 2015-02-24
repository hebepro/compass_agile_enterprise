class CreateTailDesktopApplication
  def self.up
    app = DesktopApplication.create(
      :description => 'Tail',
      :icon => 'icon-document_pulse',
      :internal_identifier => 'tail',
    )

    admin_user = User.find_by_username('admin')
    if admin_user
      admin_user.desktop_applications << app
      admin_user.save
    end
  end

  def self.down
    DesktopApplication.destroy_all(['internal_identifier = ?','tail'])
  end
end
