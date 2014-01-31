class FixedAssetPartyRole < ActiveRecord::Base
  attr_protected :created_at, :updated_at

  belongs_to :fixed_asset
  belongs_to :party
  belongs_to :role_type

end
