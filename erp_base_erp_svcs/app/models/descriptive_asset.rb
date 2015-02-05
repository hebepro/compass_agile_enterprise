# create_table :descriptive_assets do |t|
#   t.references :view_type
#   t.string :internal_identifier
#   t.text :description
#   t.string :external_identifier
#   t.string :external_id_source
#   t.references :described_record, :polymorphic => true
#
#   t.timestamps
# end
#
# add_index :descriptive_assets, :view_type_id
# add_index :descriptive_assets, [:described_record_id, :described_record_type], :name => 'described_record_idx'

class DescriptiveAsset < ActiveRecord::Base
  attr_protected :created_at, :updated_at

  belongs_to :view_type
  belongs_to :described_record, :polymorphic => true

  is_json :custom_fields
end
