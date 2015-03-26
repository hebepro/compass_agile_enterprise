module Api
  module V1
    class ApplicationsController < BaseController

      def index
        applications = Application.all

        render :json => {applications: applications.each do |application| application.to_data_hash end}
      end

      def show
        application = Application.find(params[:id])

        render :json => {application: application.to_data_hash}
      end

      def update
        application = Application.find(params[:id])

        application.description = params[:description].strip

        application.save!

        render :json => {application: application.to_data_hash}
      end

    end # ApplicationsController
  end # V1
end # Api