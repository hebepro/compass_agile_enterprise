class CreateWcodes < ActiveRecord::Migration
  def self.up

    unless table_exists?(:wcodes)
      create_table :wcodes do |t|

        t.integer :party_id
        t.string :wcode
        t.string :description
        t.string :internal_identifier
        t.text :custom_fields

        t.timestamps
      end
    end

  end

  def self.down
      if table_exists?(:wcodes)
        drop_table :wcodes
      end
  end
end
