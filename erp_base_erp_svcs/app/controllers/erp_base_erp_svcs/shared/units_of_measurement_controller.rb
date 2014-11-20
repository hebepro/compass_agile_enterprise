module ErpBaseErpSvcs
  module Shared
    class UnitsOfMeasurementController < ::ErpApp::Organizer::BaseController

      def index
        offset = params[:start] || 0
        limit = params[:limit] || 25
        query_filter = params[:query_filter].blank? ? nil : params[:query_filter].strip

        uom_tbl = UnitOfMeasurement.arel_table
        statement = UnitOfMeasurement.order('created_at asc')

        unless query_filter.blank?
          statement = statement.where(uom_tbl[:description].matches(query_filter + '%'))
        end

        # Get total count of records
        total = statement.count

        # Apply limit and offset
        units_of_measurement = statement.offset(offset).limit(limit)

        render :json => {:success => true, :total => total, :units_of_measurement => units_of_measurement.collect { |uom| uom.to_hash(:only => [:id, :description, :created_at, :updated_at]) }}

      end

      #TODO - implement show, update, delete

    end #UnitsOfMeasurementController
  end #Shared
end #ErpBaseErpSvcs

