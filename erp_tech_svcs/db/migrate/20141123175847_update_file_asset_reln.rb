class UpdateFileAssetReln < ActiveRecord::Migration
  def up
    current_file_assets = FileAsset.all.collect do |file|
      {
          id: file.id,
          holder_id: file.file_asset_holder_id,
          holder_type: file.file_asset_holder_type
      }
    end

    remove_column :file_assets, :file_asset_holder_id
    remove_column :file_assets, :file_asset_holder_type

    create_table :file_asset_holders do |t|
      t.references :file_asset
      t.references :file_asset_holder, :polymorphic => true

      t.timestamps
    end

    add_index :file_asset_holders, :file_asset_id, :name => 'file_asset_holder_file_id_idx'
    add_index :file_asset_holders, [:file_asset_holder_id, :file_asset_holder_type], :name => 'file_asset_holder_idx'

    if ::ActiveRecord::Base.connection.instance_values["config"][:adapter] == 'postgresql'
      execute('CREATE EXTENSION IF NOT EXISTS hstore;')

      add_column :file_asset_holders, :scoped_by, :hstore
      add_hstore_index :file_asset_holders, :scoped_by
    else
      add_column :file_asset_holders, :scoped_by, :text
    end

    current_file_assets.each do |file|
      FileAssetHolder.create(
          file_asset: file[:id],
          file_asset_holder_id: file[:holder_id],
          file_asset_holder_type: file[:holder_type],
      )
    end

  end

  def down
    current_file_assets = FileAssetHolder.all.collect do |file|
      {
          id: file.file_asset_id,
          holder_id: file.file_asset_holder_id,
          holder_type: file.file_asset_holder_type
      }
    end

    add_column :file_assets, :file_asset_holder_id, :integer
    add_column :file_assets, :file_asset_holder_type, :string

    current_file_assets.each do |file|
      file_asset = FileAsset.find(file[:id])

      file_asset.file_asset_holder_id = file[:holder_id]
      file_asset.file_asset_holder_type = file[:holder_type]

      file_asset.save
    end

    drop_table :file_asset_holders

  end
end
