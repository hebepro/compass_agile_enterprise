class UpdateApplications < ActiveRecord::Migration
  def up
    create_table :applications_users, :id => false do |t|
      t.references :application
      t.references :user
    end

    add_index :applications_users, :application_id, :name => 'app_users_app_idx'
    add_index :applications_users, :user_id, :name => 'app_users_user_idx'

    # get all current applications tied to app containers
    result = ActiveRecord::Base.connection.select_all('select user_id, application_id from app_containers
inner join app_containers_applications on app_containers_applications.app_container_id = app_containers.id
inner join applications on applications.id = app_containers_applications.application_id')

    ActiveRecord::Base.connection.execute("update applications set type = null where type <> 'DesktopApplication'")

    # add applications directly to users
    result.each do |row|
      user =  User.find(row['user_id'])
      user.applications << Application.find(row['application_id'])
      user.save
    end

    # drop and remove tables and columns
    drop_table :app_containers
    drop_table :app_containers_applications
    drop_table :widgets
    drop_table :applications_widgets
    remove_column :applications, :javascript_class_name
    remove_column :applications, :shortcut_id
    remove_column :applications, :xtype

    # remove all old preference types
    %w{desktop_background extjs_theme desktop_shortcut autoload_application}.each do |iid|
      pf = PreferenceType.find_by_internal_identifier(iid)
      pf.destroy if pf
    end

    # remove preference options
    %w{truenorth_logo_background blue_desktop_background grey_gradient_desktop_background purple_desktop_background planet_desktop_background portablemind_desktop_background access_extjs_theme gray_extjs_theme blue_extjs_theme}.each do |iid|
      po = PreferenceOption.find_by_internal_identifier(iid)
      po.destroy if po
    end

  end

  def down
  end
end
