module ErpInventory
  module ErpApp
    module Organizer
      module InventoryMgt
        class InventoryEntryLocationsController < ::ErpApp::Organizer::BaseController

          def show
          end

          def new
          end

          def create

            location_assignment = InventoryEntryLocation.new
            location_assignment.inventory_entry_id = params[:inventory_entry_id]
            location_assignment.facility_id = params[:facility_id]
            location_assignment.save

            render :json => {:success => true }
          end

          def edit
          end

          def update

            location_assignment = InventoryEntryLocation.find(params[:inventory_entry_location_id])
            location_assignment.fixed_asset_id = params[:fixed_asset_id]
            location_assignment.save

            render :json => {:success => true }

          end

          def destroy

            entry = InventoryEntryLocation.find(params[:inventory_entry_location_id]).destroy
            render :json => { :success => true }

          end

        end
      end #InventoryMgt
    end #Organizer
  end #ErpApp
end #ErpInventory
