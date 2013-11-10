class CreateNotifications < ActiveRecord::Migration
  def up

    unless table_exists? :notifications
      create_table :notifications do |t|
        t.string :type
        t.references :created_by_id
        t.text :message
        t.references :notification_type
        t.string :current_state
        t.text :dynamic_attributes

        t.timestamps
      end

      add_index :notifications, :notification_type_id
      add_index :notifications, :created_by_id
      add_index :notifications, :type
    end

    unless table_exists? :notification_types
      create_table :notification_types do |t|
        t.string :internal_identifier
        t.string :description

        t.timestamps
      end

      add_index :notification_types, :internal_identifier
    end

  end

  def down
    drop_table :notifications if table_exists? :notifications
    drop_table :notification_types if table_exists? :notification_types
  end
end
