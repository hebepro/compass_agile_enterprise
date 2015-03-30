class CreateShifts < ActiveRecord::Migration

  def self.up

    unless table_exists?(:shifts)
      create_table :shifts do |t|

        t.integer :party_id
        t.string :description
        t.string :internal_identifier
        t.text :custom_fields
        t.timestamp :shift_start
        t.timestamp :shift_end

        t.timestamps
      end
    end

  end

  def self.down
    if table_exists?(:shifts)
      drop_table :shifts
    end
  end


end
