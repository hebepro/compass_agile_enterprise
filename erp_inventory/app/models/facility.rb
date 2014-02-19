class Facility < ActiveRecord::Base

  has_many :inventory_entry_locations
  has_many :inventory_entries, :through => :inventory_entry_locations

  belongs_to :postal_address

  def to_data_hash
    {
        :id => self.id,
        :description => self.description,
        :address_line_1 => self.postal_address.address_line_1,
        :address_line_2 => self.postal_address.address_line_2,
        :city => self.postal_address.city,
        :state => self.postal_address.state,
        :zip => self.postal_address.zip,
        :created_at => self.created_at,
        :updated_at => self.updated_at,
    }
  end

end
