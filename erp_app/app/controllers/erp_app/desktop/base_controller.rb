module ErpApp
	module Desktop
		class BaseController < ErpApp::ApplicationController
		  layout nil
		  before_filter :require_login

		  def index
        @user     = current_user
			
        render :layout => false
		  end
		  
		end
	end
end
