class CreateDesktopAppAuditLogViewer
  def self.up
    app = DesktopApplication.create(
      :description => 'Audit Log Viewer',
      :icon => 'icon-history',
      :internal_identifier => 'audit_log_viewer'
    )
    
    admin_user = User.find_by_username('admin')
    admin_user.desktop_applications << app
    admin_user.save
  end

  def self.down
    DesktopApplication.destroy_all(['internal_identifier = ?','audit_log_viewer'])
  end
end
