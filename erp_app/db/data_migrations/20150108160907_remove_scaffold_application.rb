class RemoveScaffoldApplication
  
  def self.up
    DesktopApplication.where('internal_identifier = ?', 'scaffold').destroy_all
  end
  
  def self.down
    #remove data here
  end

end
