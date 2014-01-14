module Knitkit
  class MobileController < ::ErpApp::ApplicationController

    before_filter :set_website

    def index
    end

    protected
    def set_website
      @website = Website.find_by_host(request.host_with_port)
    end
    
  end
end
