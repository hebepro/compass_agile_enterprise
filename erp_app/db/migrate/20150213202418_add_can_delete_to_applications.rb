class AddCanDeleteToApplications < ActiveRecord::Migration
  def change
    add_column :applications, :can_delete, :boolean, :default => true
  end
end
