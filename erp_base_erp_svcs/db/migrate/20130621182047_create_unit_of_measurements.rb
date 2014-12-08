class CreateUnitOfMeasurements < ActiveRecord::Migration
  def up
    unless table_exists?(:unit_of_measurements)
      create_table :unit_of_measurements do |t|
        t.column :description, :string
        t.timestamps
      end
    end
  end

  def self.down
    [:unit_of_measurements].each do |tbl|
      if table_exists?(tbl)
        drop_table tbl
      end
    end
  end
end
