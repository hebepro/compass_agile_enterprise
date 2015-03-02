class StaffingPositionPartyRole < ActiveRecord::Migration
  # staffing_position_pty_roles
  unless table_exists?(:staffing_position_pty_roles)
    create_table :staffing_position_pty_roles do |t|
      t.references :party
      t.references :role_type
      t.references :staffing_position

      t.timestamps
    end

    add_index :staffing_position_pty_roles, :party_id, :name => "staffing_position_pty_roles_party_idx"
    add_index :staffing_position_pty_roles, :role_type_id, :name => "staffing_position_pty_roles_role_idx"
    add_index :staffing_position_pty_roles, :staffing_position_id, :name => "staffing_position_pty_roles_staff_pos_idx"
  end
end
