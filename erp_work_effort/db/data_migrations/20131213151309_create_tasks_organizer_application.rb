class CreateTasksOrganizerApplication
  def self.up
    OrganizerApplication.create(
      :description => 'Tasks',
      :icon => 'icon-note_pinned',
      :javascript_class_name => 'Compass.ErpApp.Organizer.Applications.Tasks.Base',
      :internal_identifier => 'tasks'
    )
  end

  def self.down
    OrganizerApplication.destroy_all(:conditions => ['internal_identifier = ?','tasks'])
  end
end
