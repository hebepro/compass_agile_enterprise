# create_table :charge_lines do |t|
#   t.string      :sti_type
#   t.references  :money
#   t.string      :description     #could be expanded to include type information, etc.
#   t.string      :external_identifier
#   t.string      :external_id_source
#
#   #polymorphic
#   t.references :charged_item, :polymorphic => true
#
#   t.timestamps
# end
#
# add_index :charge_lines, [:charged_item_id, :charged_item_type], :name => 'charged_item_idx'

class ChargeLine < ActiveRecord::Base
  attr_protected :created_at, :updated_at

  belongs_to :charged_item, :polymorphic => true
  belongs_to :money, :dependent => :destroy
  belongs_to :charge_type

end
