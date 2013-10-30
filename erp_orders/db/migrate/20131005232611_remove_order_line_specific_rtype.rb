class RemoveOrderLineSpecificRtype < ActiveRecord::Migration
  def up

    #this is being replaced with the standard role types
    if table_exists?(:line_item_role_types)
      drop_table :line_item_role_types
    end
  end

  def down

    #Put the old table back on the 'down' migration

    unless table_exists?(:line_item_role_types)
      create_table :line_item_role_types do |t|
        t.column  	:parent_id,    			:integer
        t.column  	:lft,          			:integer
        t.column  	:rgt,          			:integer
        #custom columns go here
        t.column  :description,         :string
        t.column  :comments,            :string
        t.column 	:internal_identifier, :string
        t.column 	:external_identifier, :string
        t.column 	:external_id_source, 	:string
        t.timestamps
      end

      add_index :line_item_role_types, :parent_id
    end

  end
end
