module ErpApp
  module Organizer
    module AssetManagement
      class FacilitiesController < ::ErpApp::Organizer::BaseController

        def index

          # Get total count of records
          total = Facility.count

          # Apply limit and offset
          facilities = Facility.all

          render :json => {:success => true, :total => total, :facilities => facilities.collect { |facility| facility.to_hash(:only => [:id, :description, :created_at, :updated_at]) }}

        end

        def show_summary

          @facility = Facility.find(params[:id]) rescue nil

        end

        def show

          facility = Facility.find(params[:facility_id])
          render :json => {:success => true, :data => facility.to_hash(:only => [:id, :description, :created_at, :updated_at]) }

        end

        def new
        end

        def create

          facility = Facility.new
          facility.description=params[:description]
          facility.save

          render :json => {:success => true, :data => facility.to_hash(:only => [:id, :description, :created_at, :updated_at]) }
        end

        def edit
        end

        def update

          facility = Facility.find(params[:facility_id])
          facility.description=params[:description]
          facility.save

          render :json => {:success => true, :data => facility.to_hash(:only => [:id, :description, :created_at, :updated_at]) }

        end

        def destroy

          facility = Facility.find(params[:facility_id]).destroy
          render :json => { :success => true }

        end

      end
    end
  end
end
