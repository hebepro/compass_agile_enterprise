module ErpApp
  module Organizer
    module InventoryMgt
      class InventoryTxnsController < ::ErpApp::Organizer::BaseController

        def index

          #puts '*********************************'
          #puts 'Called txns index method'
          #puts 'finding Inventory Transactions for Inventory Entry with ID: ' + params[:inventory_entry_id].to_s

          pickups = BizTxnEvent.joins("inner join inventory_pickup_txns ipt on biz_txn_events.biz_txn_record_id = ipt.id").where("biz_txn_events.biz_txn_record_type = 'InventoryPickupTxn'").where("ipt.inventory_entry_id = ?", params[:inventory_entry_id])
          dropoffs = BizTxnEvent.joins("inner join inventory_dropoff_txns idt on biz_txn_events.biz_txn_record_id = idt.id").where("biz_txn_events.biz_txn_record_type = 'InventoryDropoffTxn'").where("idt.inventory_entry_id = ?", params[:inventory_entry_id])
          all_inventory_txns = pickups + dropoffs

          # Get total count of records
          total = all_inventory_txns.count

          # TODO: Apply limit and offset

          render :json => {:success => true, :total => total, :inventory_txns => all_inventory_txns.collect { |txn| txn.to_hash(:only => [:id, :description, :created_at, :updated_at], :model => txn.biz_txn_record_type ) }}

        end

        def show
          @inventory_entry = InventoryEntry.find(params[:id]) rescue nil
      end

      end #InventoryTxnsController
    end #InventoryMgt
  end #Organizer
end #ErpApp