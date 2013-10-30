## Relationship between Parties and Fixed Assets to see who may been assigned or checked out
## an asset.
## IMPORTANT NOTE: The base framework does not extend Party or Fixed Asset to automatically show these
## relationships. It is considered purpose-specific enough so that Party and Fixed asset can be given
## the relationship code on a case-by-case basis.

class PartyFixedAssetAssignment < ActiveRecord::Base
  attr_protected :created_at, :updated_at
  # attr_accessible :title, :body
  belongs_to  :party
  belongs_to  :fixed_asset
end
