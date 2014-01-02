module ErpInventory
  module ErpApp
    module Organizer
      module AssetManagement
        class FacilitiesController < ::ErpApp::Organizer::BaseController

          def index
            offset = params[:start] || 0
            limit = params[:limit] || 25
            query_filter = params[:query_filter].blank? ? nil : params[:query_filter].strip

            factility_tbl = Facility.arel_table
            statement = Facility.order('created_at asc')

            unless query_filter.blank?
              statement = statement.where(factility_tbl[:description].matches(query_filter + '%'))
            end

            # Get total count of records
            total = statement.count

            # Apply limit and offset
            facilities = statement.offset(offset).limit(limit)

            render :json => {:success => true, :total => total, :facilities => facilities.collect { |facility| facility.to_hash(:only => [:id, :description, :created_at, :updated_at]) }}

          end

          def show_summary

            @facility = Facility.find(params[:id]) rescue nil

          end

          def show

            facility = Facility.find(params[:facility_id])
            render :json => {:success => true, :data => facility.to_hash(:only => [:id, :description, :created_at, :updated_at])}

          end

          def new
          end

          def create

            facility = Facility.new
            facility.description=params[:description]
            facility.save

            render :json => {:success => true, :data => facility.to_hash(:only => [:id, :description, :created_at, :updated_at])}
          end

          def edit
          end

          def update

            facility = Facility.find(params[:facility_id])
            facility.description=params[:description]
            facility.save

            render :json => {:success => true, :data => facility.to_hash(:only => [:id, :description, :created_at, :updated_at])}

          end

          def destroy

            facility = Facility.find(params[:facility_id]).destroy
            render :json => {:success => true}

          end

        end
      end #AssetManagement
    end #Organizer
  end #ErpApp
end #ErpInventory
