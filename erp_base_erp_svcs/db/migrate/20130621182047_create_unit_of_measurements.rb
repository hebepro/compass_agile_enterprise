class CreateUnitOfMeasurements < ActiveRecord::Migration
  def up
    unless table_exists?(:unit_of_measurements)
      create_table :unit_of_measurements do |t|
        t.column :description, :string
        t.timestamps
      end
    end
    unless columns(:order_line_items).collect {|c| c.name}.include?('unit_of_measurement_id')
      add_column :order_line_items, :unit_of_measurement_id, :integer
    end  
  end

  def self.down
    [ :unit_of_measurements ].each do |tbl|
      if table_exists?(tbl)
        drop_table tbl
      end
    end
    if columns(:order_line_items).collect {|c| c.name}.include?('unit_of_measurement_id')
      remove_column :order_line_items, :unit_of_measurement_id
    end  
  end
end
