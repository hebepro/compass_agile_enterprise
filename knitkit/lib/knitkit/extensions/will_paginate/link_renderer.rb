require 'will_paginate/view_helpers/action_view'

module Knitkit
  module Extensions
    module WillPaginate
      class LinkRenderer < ::WillPaginate::ActionView::LinkRenderer

        protected

        def page_number(page)
          unless page == current_page
            tag(:li, link(page, page, :rel => rel_value(page)))
          else
            tag(
                :li,
                tag(:a, "#{page} #{tag(:span, '(current)', :class => 'sr-only')}"),
                :class => 'active'
            )

          end
        end

        def previous_page
          num = @collection.current_page > 1 && @collection.current_page - 1
          previous_or_next_page(num, '&laquo;')
        end

        def next_page
          num = @collection.current_page < @collection.total_pages && @collection.current_page + 1
          previous_or_next_page(num, '&raquo;')
        end

        def previous_or_next_page(page, text)
          if page
            tag(:li, link(text, page))
          else
            tag(:li, link(text, 'javascript:void('');'), :class => 'disabled')
          end
        end

        def html_container(html)
          tag(:ul, html, :class => 'pagination')
        end

        def url(page)
          @base_url_params ||= begin
            url_params = merge_get_params(default_url_params)
            merge_optional_params(url_params)
          end

          url_params = @base_url_params.dup
          add_current_page_param(url_params, page)

          if url_params[:scope]
            scope = url_params[:scope]
            url_params.delete(:scope)

            scope.url_for(url_params)
          else
            @template.url_for(url_params)
          end
        end

      end # LinkRenderer
    end # WillPaginate
  end # Extensions
end # Knitkit
