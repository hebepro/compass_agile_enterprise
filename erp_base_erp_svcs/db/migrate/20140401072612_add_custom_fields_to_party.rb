class AddCustomFieldsToParty < ActiveRecord::Migration
  def change
    if ::ActiveRecord::Base.connection.instance_values["config"][:adapter] == 'postgresql'
      execute('CREATE EXTENSION IF NOT EXISTS hstore;')

      add_column :parties, :custom_fields, :hstore
      add_hstore_index :parties, :custom_fields
    else
      add_column :parties, :custom_fields, :text
    end
  end
end
