module Knitkit
  class MobileController < ::ErpApp::ApplicationController

    before_filter :set_website

    def index
      @current_user = current_user

    end

    protected
    def set_website
      @website = Website.find_by_host(request.host_with_port)
    end
    
  end
end
