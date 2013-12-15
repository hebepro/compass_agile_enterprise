class AddWorkItemToWorkEffort < ActiveRecord::Migration
  def change
    add_column :work_efforts, :work_effort_item_type, :string
    add_column :work_efforts, :work_effort_item_id, :string

    add_index :work_efforts, [:work_effort_item_type, :work_effort_item_id], :name => 'work_item_idx'
  end
end
