class CreateFacilities < ActiveRecord::Migration
  def up

    unless table_exists?(:facilities)
      create_table :facilities do |t|

        t.string  :description
        t.string  :internal_identifier
        t.integer :facility_type_id

        #polymorphic columns
        t.integer :facility_record_id
        t.integer :facility_record_type

        t.timestamps
      end

      add_index :facilities,  [:facility_record_id, :facility_record_type], :name => "facility_record_idx"
    end

    unless table_exists?(:facility_types)
      create_table :facility_types do |t|

        t.string  :description
        t.string  :internal_identifier
        t.string  :external_identifier
        t.string  :external_identifer_source

        #these columns are required to support the behavior of the plugin 'awesome_nested_set'
        t.integer :parent_id
        t.integer :lft
        t.integer :rgt

        t.timestamps
      end

      add_index :facility_types,  [:parent_id, :lft, :rgt], :name => "facility_types_nested_set_idx"
    end

    ##********************************************************************************************
    ## Infrastructure and Accounting
    ##********************************************************************************************
    ## TODO Move to a basic accounting engine
    unless table_exists?(:fixed_assets)
      create_table :fixed_assets do |t|

        #foreign key references
        t.references :fixed_asset_type

        #custom columns go here
        t.string :description
        t.string :comments
        t.string :internal_identifier
        t.string :external_identifier
        t.string :external_id_source

        #polymorphic columns
        t.string  :fixed_asset_record_type
        t.integer :fixed_asset_record_id

        t.timestamps
      end

      add_index :fixed_assets,  [:fixed_asset_record_type, :fixed_asset_record_id], :name => "fixed_assets_record_idx"
      add_index :fixed_assets,  :fixed_asset_type_id, :name => "fixed_assets_fixed_asset_type_idx"
    end

    unless table_exists?(:fixed_asset_types)
      create_table :fixed_asset_types do |t|
        #these columns are required to support the behavior of the plugin 'awesome_nested_set'
        t.integer :parent_id
        t.integer :lft
        t.integer :rgt

        #custom columns go here
        t.string :description
        t.string :comments
        t.string :internal_identifier
        t.string :external_identifier
        t.string :external_id_source

        t.timestamps
      end

      add_index :fixed_asset_types,  [:parent_id, :lft, :rgt], :name => "fixed_asset_types_nested_set_idx"
    end

    ##Not a relationship with work_effort, but stores which fixed assets are assigned to or checked-out by parties
    unless table_exists?(:party_fixed_asset_assignments)
      create_table :party_fixed_asset_assignments do |t|
        #foreign key references
        t.references  :party
        t.references  :fixed_asset

        t.datetime    :assigned_from
        t.datetime    :assigned_thru
        t.integer     :allocated_cost_money_id

        t.timestamps
      end

      add_index :party_fixed_asset_assignments,  [:party_id, :fixed_asset_id], :name => "party_fixed_asset_assign_idx"
    end

  end

  def down
    drop_table :facilities
    drop_table :facility_types
    drop_table :fixed_assets
    drop_table :fixed_asset_types
    drop_table :party_fixed_asset_assignments
  end
end
