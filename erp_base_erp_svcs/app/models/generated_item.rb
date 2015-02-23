# create_table :generated_items do |t|
#   t.references :generated_by, :polymorphic => true
#   t.references :generated_record, :polymorphic => true
#
#   t.timestamps
# end
#
# add_index :generated_items, [:generated_by_type, :generated_by_id], :name => 'generated_by_idx'
# add_index :generated_items, [:generated_record_type, :generated_record_id], :name => 'generated_record_idx'

class GeneratedItem < ActiveRecord::Base
  attr_protected :created_at, :updated_at

  belongs_to :generated_record, :polymorphic => true
  belongs_to :generated_by, :polymorphic => true
  
end