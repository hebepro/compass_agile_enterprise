class CreateWorkEffortPartyRoles < ActiveRecord::Migration
  def up
    unless table_exists?(:work_effort_party_roles)
      create_table :work_effort_party_roles do |t|
        t.integer :work_effort_id
        t.integer :party_id
        t.integer :role_type_id
      end
      add_index :work_effort_party_roles, :work_effort_id
      add_index :work_effort_party_roles, :party_id
      add_index :work_effort_party_roles, :role_type_id
    end
  end

  def down
    [ :work_effort_party_roles ].each do |tbl|
      if table_exists?(tbl)
        drop_table tbl
      end
    end
  end
end
