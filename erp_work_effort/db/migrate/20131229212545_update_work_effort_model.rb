class UpdateWorkEffortModel < ActiveRecord::Migration
  def up

    add_column :work_efforts, :start_date, :date
    add_column :work_efforts, :end_date, :date
    add_column :work_efforts, :percent_done, :decimal

  end

  def down
    remove_column :work_efforts, :start_date
    remove_column :work_efforts, :end_date
    remove_column :work_efforts, :percent_done
  end
end
