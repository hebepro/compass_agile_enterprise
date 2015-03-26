module Knitkit
  module ErpApp
    module Desktop
      class OnlineDocumentSectionsController < Knitkit::ErpApp::Desktop::AppController

        def create
          @website = Website.find(params[:website_id])
          online_document_section = OnlineDocumentSection.new(:website_id => @website.id,
                                                              :in_menu => params[:in_menu] == 'yes', :title => params[:title],
                                                              :internal_identifier => params[:internal_identifier])

          if online_document_section.save
            if params[:website_section_id]
              parent_website_section = WebsiteSection.find(params[:website_section_id])
              online_document_section.move_to_child_of(parent_website_section)
            end
            online_document_section.update_path!

            documented_content = DocumentedContent.create(:title => online_document_section.title, :created_by => current_user, :body_html => online_document_section.title)
            DocumentedItem.create(:documented_content_id => documented_content.id, :online_document_section_id => online_document_section.id)

            result = {:success => true,
                      :node => build_section_hash(online_document_section),
                      :documented_content => documented_content.content_hash}
          else
            message = "<ul>"
            online_document_section.errors.collect do |e, m|
              message << "<li>#{e} #{m}</li>"
            end
            message << "</ul>"
            result = {:success => false, :message => message}
          end

          render :json => result
        end

        def existing_documents
          website = Website.find(params[:website_id])
          OnlineDocumentSection.class_eval do
            def title_permalink
              "#{self.title} - #{self.path}"
            end
          end
          render :inline => website.online_document_sections.to_json(:only => [:id], :methods => [:title_permalink])
        end

        def content
          document_section = OnlineDocumentSection.find(params[:id])

          render :json => {success: true, content: document_section.documented_item_content_html}
        end

        def copy
          begin

            @website = Website.find(params[:website_id])
            parent_section = WebsiteSection.where('id = ?', params[:parent_section_id]).first
            section_to_copy = OnlineDocumentSection.find(params[:id])

            new_section = section_to_copy.copy(params[:title].strip, true, current_user)

            if parent_section
              new_section.move_to_child_of(parent_section)
              new_section.save
            end

            # update all children paths after all are saved.
            new_section.self_and_descendants.each do |section|
              section.update_path!
            end

            result = {:success => true,
                      :parentNodeId => params[:parent_section_id],
                      :node => build_section_hash(new_section)}


          rescue => ex
            # TODO send error notification
            Rails.logger.error ex.message
            Rails.logger.error ex.backtrace.join("\n")

            ExceptionNotifier.notify_exception(ex) if defined? ExceptionNotifier

            result = {:success => false, :message => 'Could not copy Document'}
          end

          render :json => result
        end

      end # OnlineDocumentSectionsController
    end # Desktop
  end # ErpApp
end # Knitkit