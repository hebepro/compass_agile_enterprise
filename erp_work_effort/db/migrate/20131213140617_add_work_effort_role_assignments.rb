class AddWorkEffortRoleAssignments < ActiveRecord::Migration
  def up

    create_table :role_types_work_efforts do |t|
      t.references :role_type
      t.references :work_effort
    end

    add_index :role_types_work_efforts, [:role_type_id, :work_effort_id], :name => 'role_type_work_effort_idx'

  end

  def down
    drop_table :role_types_work_efforts
  end
end
