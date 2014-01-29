class AddPostalAddressToFacility < ActiveRecord::Migration
  def change
    add_column :facilities, :postal_address_id, :integer
  end
end
