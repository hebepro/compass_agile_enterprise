class CreateTailDesktopApplication
  def self.up
    app = DesktopApplication.create(
      :description => 'Tail',
      :icon => 'icon-document_pulse',
      :javascript_class_name => 'Compass.ErpApp.Desktop.Applications.Tail',
      :internal_identifier => 'tail',
      :shortcut_id => 'tail-win'
    )
    
    app.preference_types << PreferenceType.iid('desktop_shortcut')
    app.preference_types << PreferenceType.iid('autoload_application')
    app.save
  end

  def self.down
    DesktopApplication.destroy_all(['internal_identifier = ?','tail'])
  end
end
