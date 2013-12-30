class InventoryEntry < ActiveRecord::Base
  attr_protected :created_at, :updated_at

	belongs_to  :inventory_entry_record, :polymorphic => true
	belongs_to  :product_type
	has_one     :classification, :as => :classification, :class_name => 'CategoryClassification'
	has_many    :prod_instance_inv_entries
	has_many    :product_instances, :through => :prod_instance_inv_entries do
    def available
      includes([:prod_availability_status_type]).where('prod_availability_status_types.internal_identifier = ?', 'available')
    end

    def sold
      includes([:prod_availability_status_type]).where('prod_availability_status_types.internal_identifier = ?', 'sold')
    end
  end
  has_many :inventory_entry_locations
  has_many :facilities, :through => :inventory_entry_locations

  alias_method :storage_facilities, :facilities

  def current_location
    self.inventory_entry_locations
  end

  def current_storage_facility
    inventory_entry_locations.last.facility
  end

  def current_storage_facility=(facility)
    location = InventoryEntryLocation.new
    location.facility = facility
    location.inventory_entry = self
    location.save
  end

  def current_storage_facility_id=(facility_id)
    location = InventoryEntryLocation.new
    location.facility_id = facility_id
    location.inventory_entry = self
    location.save
  end

  def to_data_hash
    {
        :id => self.id,
        :description => self.description,
        :number_available => self.number_available,
        :sku => self.sku,
        :inventory_storage_facility_id => (self.current_storage_facility.id rescue nil),
        :inventory_storage_facility_description => (self.current_storage_facility.description rescue nil),
        :created_at => self.created_at,
        :updated_at => self.updated_at
    }
  end

	 
  def to_label
    "#{description}"
  end

end
