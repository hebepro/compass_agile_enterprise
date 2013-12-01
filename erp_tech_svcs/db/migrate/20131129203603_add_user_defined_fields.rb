class AddUserDefinedFields < ActiveRecord::Migration
  def up

    unless table_exists? :user_defined_data
      create_table :user_defined_data do |t|
        t.string :scope
        t.string :model_name

        t.timestamps
      end

      add_index :user_defined_data, :scope
    end

    unless table_exists? :user_defined_fields
      create_table :user_defined_fields do |t|
        t.string :field_name
        t.string :label
        t.string :data_type
        t.references :user_defined_data

        t.timestamps
      end

      add_index :user_defined_fields, :user_defined_data_id
      add_index :user_defined_fields, :field_name
    end

  end

  def down

    if table_exists? :user_defined_data
      drop_table :user_defined_data
    end

    if table_exists? :user_defined_fields
      drop_table :user_defined_fields
    end

  end

end
