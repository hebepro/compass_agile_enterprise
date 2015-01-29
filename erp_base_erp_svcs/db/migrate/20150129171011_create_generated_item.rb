class CreateGeneratedItem < ActiveRecord::Migration
  def up
    create_table :generated_items do |t|
      t.references :generated_by, :polymorphic => true
      t.references :generated_record, :polymorphic => true

      t.timestamps
    end

    add_index :generated_items, [:generated_by_type, :generated_by_id], :name => 'generated_by_idx'
    add_index :generated_items, [:generated_record_type, :generated_record_id], :name => 'generated_record_idx'
  end

  def down
    drop_table :generated_items
  end
end
