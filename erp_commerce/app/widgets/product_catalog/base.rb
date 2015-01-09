module Widgets
  module ProductCatalog
    class Base < ErpApp::Widgets::Base
      def index
        @context = {
            user_id: current_user ? current_user.id : nil,
            price_range: params[:minVal] && params[:maxVal] && params[:minVal] != '' && params[:maxVal] != '' ? [params[:minVal], params[:maxVal]] : nil,
            keyword: params[:keyword] && params[:keyword] != '' ? params[:keyword] : nil
        }

        if params[:categoryId] && params[:categoryId] != ''
          @category_id = params[:categoryId]
          @parent_category_id = Category.find(@category_id).parent_id
          @context[:category_id] = @category_id
        end

        @per_page = 9

        @page = params[:page].to_i && params[:page].to_i > 0 ? params[:page].to_i : 1

        @context[:limit] = @per_page

        @context[:offset] = ((@page - 1) * @per_page)

        result = ErpCommerce::BasicOfferEngine.new(@context).filter
        @offers = result[:results_hash_array]

        @number_pages = result[:metadata][:number_pages]

        @category_list = ProductType.to_html_list(Category.where(description: 'ProductType Main').first)

        if request.xhr?
          render :update => {:id => widget_result_id, :view => 'index'}
        else
          render
        end
      end

      def show
        @offer = ErpCommerce::BasicOfferEngine.new(user_id: current_user ? current_user.id : nil,
                                                   product_type_id: params[:id].to_i
        ).filter[:results_hash_array].first

        render :update => {:id => "#{@uuid}_result", :view => 'show'}
      end

      def add_to_cart
        @offer = ErpCommerce::BasicOfferEngine.new(user_id: current_user ? current_user.id : nil,
                                                   product_type_id: params[:id].to_i
        ).filter[:results_hash_array].first

        @cart_items_url = params[:cart_items_url]

        ErpCommerce::OrderHelper.new(self).add_to_cart(@offer)

        render :update => {:id => "#{@uuid}_result", :view => 'add_to_cart'}
      end

      #should not be modified
      #modify at your own risk
      def locate
        File.dirname(__FILE__)
      end

      class << self
        def title
          "Product Catalog"
        end

        def widget_name
          File.basename(File.dirname(__FILE__))
        end

        def base_layout
          begin
            file = File.join(File.dirname(__FILE__), "/views/layouts/base.html.erb")
            IO.read(file)
          rescue
            return nil
          end
        end
      end
    end #Base
  end #ProductCatalog
end #Widgets

