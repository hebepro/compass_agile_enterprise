class InventoryEntryLocation < ActiveRecord::Base

  default_scope order('created_at ASC')

  belongs_to  :inventory_entry
  belongs_to  :facility
  belongs_to  :postal_address

  def address
    self.postal_address
  end

end
