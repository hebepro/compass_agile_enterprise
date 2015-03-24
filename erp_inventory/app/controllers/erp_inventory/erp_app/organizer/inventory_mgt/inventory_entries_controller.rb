module ErpInventory
  module ErpApp
    module Organizer
      module InventoryMgt
        class InventoryEntriesController < ::ErpApp::Organizer::BaseController

          def index
            offset = params[:start] || 0
            limit = params[:limit] || 25
            query_filter = params[:query_filter].blank? ? nil : params[:query_filter].strip
            facility_id = params[:facility_id].blank? ? nil : params[:facility_id].strip
            party_id = params[:party_id]

            inventory_entry_tbl = InventoryEntry.arel_table

            # scope by party if have party id
            if party_id.blank?
              statement = InventoryEntry.order('created_at asc')
            else
              statement = InventoryEntry.joins(product_type: :product_type_pty_roles).where('product_type_pty_roles.party_id = ?', party_id).order('created_at asc')
            end

            # apply filters if present
            statement = statement.where(inventory_entry_tbl[:description].matches(query_filter + '%')) if query_filter

            # apply facility if present
            statement = statement.joins(:inventory_entry_locations).where('facility_id = ?', facility_id) if facility_id

            # Get total count of records
            total = statement.count

            # Apply limit and offset
            inventory_entries = statement.offset(offset).limit(limit)

            render :json => {:success => true, :total => total, :inventory_entries => inventory_entries.collect { |entry| entry.to_data_hash }}

          end

          def show_summary

            @inventory_entry = InventoryEntry.find(params[:id]) rescue nil

          end

          def show

            entry = InventoryEntry.find(params[:inventory_entry_id])
            render :json => {:success => true, :data => entry.to_data_hash}

          end

          def new
          end

          def create

            begin
              ActiveRecord::Base.transaction do
                entry = InventoryEntry.new
                entry.description=params[:description]
                entry.sku=params[:sku]
                entry.unit_of_measurement_id=params[:unit_of_measurement]
                entry.number_in_stock=params[:number_in_stock]
                entry.number_available=params[:number_available]
                entry.product_type_id=params[:product_type_id]
                entry.save

                location_assignment = InventoryEntryLocation.new
                location_assignment.inventory_entry = entry
                location_assignment.facility_id = params[:inventory_facility]
                location_assignment.save

                render :json => {:success => true, :data => entry.to_hash(:only => [:id, :description, :created_at, :updated_at], :model => 'InventoryEntry')}
              end
            rescue => ex
              Rails.logger.error ex.message
              Rails.logger.error ex.backtrace.join("\n")

              ExceptionNotifier.notify_exception(ex) if defined? ExceptionNotifier

              render :json => {:success => false, :message => ex.message}
            end
          end

          def edit
            puts "edit called"
          end

          def update
            begin
              ActiveRecord::Base.transaction do
                entry = InventoryEntry.find(params[:inventory_entry_id])
                current_facility = entry.current_storage_facility
                entry.description=params[:description]
                entry.sku=params[:sku]
                entry.unit_of_measurement_id=params[:unit_of_measurement]
                entry.number_available=params[:number_available]
                entry.number_in_stock=params[:number_in_stock]
                entry.product_type_id=params[:product_type_id]
                entry.save

                if current_facility.id != params[:inventory_facility].to_i
                  location_assignment = InventoryEntryLocation.new
                  location_assignment.inventory_entry = entry
                  location_assignment.facility_id = params[:inventory_facility]
                  location_assignment.save
                end

                render :json => {:success => true, :data => entry.to_hash(:only => [:id, :description, :created_at, :updated_at], :model => 'InventoryEntry')}
              end
            rescue Exception => e
              Rails.logger.error e.message
              Rails.logger.error e.backtrace.join("\n")
              render :json => {:success => false, :message => e.message}
            end
          end

          def destroy

            entry = InventoryEntry.find(params[:inventory_entry_id])
            render :json => {:success => entry.destroy}

          end

        end
      end #InventoryMgt
    end #Organizer
  end #ErpApp
end #ErpInventory
