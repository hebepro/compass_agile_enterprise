class UpdateWorkEffortItemIdToInt < ActiveRecord::Migration
  def up
    remove_index :work_efforts, :name => 'work_item_idx'

    # get current values
    current_values = WorkEffort.select([:id, :work_effort_item_id])
                               .where('work_effort_item_id is not null')
                               .collect { |wf| {id: wf.id, work_effort_item_id: wf.work_effort_item_id} }

    remove_column :work_efforts, :work_effort_item_id
    add_column :work_efforts, :work_effort_item_id, :integer

    current_values.each do |values|

      wf = WorkEffort.find(values[:id])
      wf.work_effort_item_id = values[:work_effort_item_id]
      wf.save

    end

    add_index :work_efforts, [:work_effort_item_type, :work_effort_item_id], :name => 'work_item_idx'
  end

  def down
    # no going back
  end
end
