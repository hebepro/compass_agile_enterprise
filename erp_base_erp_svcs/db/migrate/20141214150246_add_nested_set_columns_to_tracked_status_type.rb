class AddNestedSetColumnsToTrackedStatusType < ActiveRecord::Migration
  def change
    add_column :tracked_status_types, :parent_id, :integer, :index => true
    add_column :tracked_status_types, :lft, :integer, :index => true
    add_column :tracked_status_types, :rgt, :integer, :index => true

    TrackedStatusType.rebuild!
  end
end
