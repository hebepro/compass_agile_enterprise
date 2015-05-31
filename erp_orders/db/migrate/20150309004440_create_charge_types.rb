class CreateChargeTypes < ActiveRecord::Migration
  def change
    unless table_exists?(:charge_types)
      create_table :charge_types do |t|
        t.string :description
        t.timestamps
      end
    end
  end
end
