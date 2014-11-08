class AddScopedByToFileAssets < ActiveRecord::Migration
  def change

    if ::ActiveRecord::Base.connection.instance_values["config"][:adapter] == 'postgresql'
      execute('CREATE EXTENSION IF NOT EXISTS hstore;')

      add_column :file_assets, :scoped_by, :hstore
      add_hstore_index :file_assets, :scoped_by
    else
      add_column :file_assets, :scoped_by, :text
    end

  end
end
