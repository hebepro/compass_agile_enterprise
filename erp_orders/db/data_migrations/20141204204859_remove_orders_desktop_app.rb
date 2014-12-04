class RemoveOrdersDesktopApp
  
  def self.up
    application = DesktopApplication.where('internal_identifier = ?', 'order_manager').first
    application.destroy if application
  end
  
  def self.down
    #remove data here
  end

end
