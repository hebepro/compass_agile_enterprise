class CreateWcCodes < ActiveRecord::Migration
  def self.up

    unless table_exists?(:wc_codes)
      create_table :wc_codes do |t|

        t.integer :party_id
        t.string :wc_code
        t.string :description
        t.string :internal_identifier
        t.text :custom_fields

        t.timestamps
      end
    end

  end

  def self.down
    if table_exists?(:wc_codes)
      drop_table :wc_codes
    end
  end
end
