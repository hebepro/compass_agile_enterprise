class CreateInventoryMgtOrganizerApplication
  def self.up
    OrganizerApplication.create(
      :description => 'Inventory Mgt',
      :icon => 'icon-tasks',
      :javascript_class_name => 'Compass.ErpApp.Organizer.Applications.InventoryMgt.Base',
      :internal_identifier => 'inventory_mgt'
    )
  end

  def self.down
    OrganizerApplication.destroy_all(:conditions => ['internal_identifier = ?','inventory_mgt'])
  end
end
