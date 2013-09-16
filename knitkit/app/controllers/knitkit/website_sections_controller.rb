module Knitkit
  class WebsiteSectionsController < BaseController

    def index
      @current_user = current_user
      @contents = Article.find_published_by_section(@active_publication, @website_section)
      layout = @website_section.get_published_layout(@active_publication)

      if params[:is_mobile]
        layout.nil? ? (render :layout => false) : (render :inline => layout)
      elsif layout.nil?
        @website_section.render_base_layout? ? (render) : (render :layout => false)
      else
        @website_section.render_base_layout? ? (render :inline => layout, :layout => 'knitkit/base') : (render :inline => layout)
      end

    end
    
  end
end
