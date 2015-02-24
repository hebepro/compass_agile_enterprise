module Api
  module V1
    class BaseController < ActionController::Base

      before_filter :require_login
      layout false

      protected

      def not_authenticated
        session[:return_to_url] = request.env['REQUEST_URI']
        redirect_to '/erp_app/login', :notice => "Please login first."
      end

    end
  end # V1
end # Api

