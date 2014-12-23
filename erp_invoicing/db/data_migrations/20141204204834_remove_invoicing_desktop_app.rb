class RemoveInvoicingDesktopApp
  
  def self.up
    application = DesktopApplication.where('internal_identifier = ?', 'invoice_management').first
    application.destroy if application
  end
  
  def self.down
    #remove data here
  end

end
