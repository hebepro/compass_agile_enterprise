class FixedAsset < ActiveRecord::Base
  attr_protected :created_at, :updated_at

  belongs_to :fixed_asset_type
  belongs_to :fixed_asset_record, :polymorphic => true

end
