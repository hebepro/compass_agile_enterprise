class AddCustomFieldsToNotifications < ActiveRecord::Migration
  def change
    if ::ActiveRecord::Base.connection.instance_values["config"][:adapter] == 'postgresql'
      execute('CREATE EXTENSION IF NOT EXISTS hstore;')
      
      add_column :notifications, :custom_fields, :hstore
      add_hstore_index :notifications, :custom_fields
    else
      add_column :notifications, :custom_fields, :text
    end
  end
end
