module ErpApp
	class LoginController < ApplicationController
	  layout :nil
	  
	  def index
	    if params[:application] == 'desktop'
	      @app_container = '/erp_app/desktop/'
	    else
	      @app_container = '/erp_app/organizer/'
      end
	  end
	  
	end
end