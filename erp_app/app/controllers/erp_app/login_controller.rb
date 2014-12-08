module ErpApp
  class LoginController < ApplicationController
    layout :nil

    def index
      if session[:return_to_url]
        if session[:return_to_url].include? 'erp_app/desktop'
          @app_container = '/erp_app/desktop/'
        else
          @app_container = '/erp_app/organizer/'
        end
      else
        if params[:application] == 'desktop'
          @app_container = '/erp_app/desktop/'
        else
          @app_container = '/erp_app/organizer/'
        end
      end

    end

  end
end