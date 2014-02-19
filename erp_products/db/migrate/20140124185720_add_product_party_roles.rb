class AddProductPartyRoles < ActiveRecord::Migration
  def up
    create_table :product_type_pty_roles do |t|
      t.references :party
      t.references :role_type
      t.references :product_type

      t.timestamps
    end
  end

  def down
    [:product_type_pty_roles].each do |tbl|
      drop_table tbl
    end
  end
end
