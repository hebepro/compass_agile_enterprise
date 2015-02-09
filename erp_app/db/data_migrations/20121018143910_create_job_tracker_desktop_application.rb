class CreateJobTrackerDesktopApplication
  def self.up
    app = DesktopApplication.create(
      :description => 'Job Tracker',
      :icon => 'icon-calendar',
      :internal_identifier => 'job_tracker'
    )

    admin_user = User.find_by_username('admin')
    admin_user.desktop_applications << app
    admin_user.save
  end

  def self.down
    DesktopApplication.destroy_all(['internal_identifier = ?','job_tracker'])
  end
end
