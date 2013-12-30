class CreateInvTxnTypes
  
  def self.up

    def self.up
      # Create the distinct stop types used by work orders + complex shipments
      base_type = BizTxnType.create( :internal_identifier => "inventory_txn", :description => "Inventory Transaction")
      inv_pickup = BizTxnType.create( :internal_identifier => "inventory_pickup_txn", :description => "Inventory Pickup Transaction")
      inv_dropoff = BizTxnType.create( :internal_identifier => "inventory_dropoff_txn", :description => "Inventory Dropoff Transaction")

    end

  end
  
  def self.down
    BizTxnType.iid('inv_txn').destroy
    BizTxnType.iid('inventory_pickup_txn').destroy
    BizTxnType.iid('inventory_dropoff_txn').destroy
  end

end
