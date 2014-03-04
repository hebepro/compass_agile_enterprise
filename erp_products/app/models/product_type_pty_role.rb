class ProductTypePtyRole < ActiveRecord::Base
  belongs_to :product_type
  belongs_to :party
  belongs_to :role_type
end