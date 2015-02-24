class AddFileManagerApplication
  
  def self.up
    if DesktopApplication.find_by_internal_identifier('file_manager').nil?
      app = DesktopApplication.create(
        :description => 'File Manager',
        :icon => 'icon-folders',
        :internal_identifier => 'file_manager'
      )
    
      admin_user = User.find_by_username('admin')
      admin_user.desktop_applications << app
      admin_user.save
    end
  end
  
  def self.down
    DesktopApplication.find_by_internal_identifier('file_manager').destroy
  end

end
