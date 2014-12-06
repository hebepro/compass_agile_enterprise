class ProductTypePtyRole < ActiveRecord::Base
  attr_protected :created_at, :updated_at

  belongs_to :product_type
  belongs_to :party
  belongs_to :role_type
end