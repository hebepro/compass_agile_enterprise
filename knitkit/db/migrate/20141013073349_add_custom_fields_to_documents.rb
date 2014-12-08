class AddCustomFieldsToDocuments < ActiveRecord::Migration
  def change
    if ::ActiveRecord::Base.connection.instance_values["config"][:adapter] == 'postgresql'
      execute('CREATE EXTENSION IF NOT EXISTS hstore;')
      
      add_column :documents, :custom_fields, :hstore
      add_hstore_index :documents, :custom_fields
    else
      add_column :documents, :custom_fields, :text
    end
  end
end
