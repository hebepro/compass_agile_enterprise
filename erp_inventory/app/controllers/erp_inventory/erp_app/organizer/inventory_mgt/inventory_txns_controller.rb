module ErpInventory
  module ErpApp
    module Organizer
      module InventoryMgt
        class InventoryTxnsController < ::ErpApp::Organizer::BaseController

          def index
            offset = params[:start] || 0
            limit = params[:limit] || 25

            statement = BizTxnEvent.joins("left outer join inventory_pickup_txns ipt on biz_txn_events.biz_txn_record_id = ipt.id
                               and biz_txn_events.biz_txn_record_type = 'InventoryPickupTxn'")
            .joins("left outer join inventory_dropoff_txns idt on biz_txn_events.biz_txn_record_id = idt.id
                               and biz_txn_events.biz_txn_record_type = 'InventoryDropoffTxn'")
            .where("idt.inventory_entry_id = ? or ipt.inventory_entry_id = ?", params[:inventory_entry_id], params[:inventory_entry_id])
            .order('updated_at ASC')
            .uniq

            # Get total count of records
            total = statement.count

            # apply limit and offset
            inventory_txns = statement.offset(offset).limit(limit)

            render :json => {:success => true, :total => total, :inventory_txns => inventory_txns.collect { |txn| txn.to_hash(:only => [:id, :description, :created_at, :updated_at], :model => txn.biz_txn_record_type) }}

          end

          def show
            @inventory_entry = InventoryEntry.find(params[:id]) rescue nil
          end

        end #InventoryTxnsController
      end #InventoryMgt
    end #Organizer
  end #ErpApp
end #ErpInventory