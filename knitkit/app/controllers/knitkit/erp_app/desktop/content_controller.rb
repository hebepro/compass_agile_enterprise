module Knitkit
  module ErpApp
    module Desktop
      
      class ContentController < Knitkit::ErpApp::Desktop::AppController
        def update
          result = {:success => true}
          begin
            current_user.with_capability('edit_html', 'Content') do
              id      = params[:id]
              html    = params[:html]
              content = Content.find(id)
              content.body_html = html

              #TODO this should probably be moved into the view
              if content.altered?
                if content.save
                  unless params[:site_id].blank?
                    website = Website.find(params[:site_id])
                    content.publish(website, 'Auto Publish', content.version, current_user) if website.publish_on_save?
                  end
                  #added for inline editing
                  result[:last_update] = content.updated_at.strftime("%m/%d/%Y %I:%M%p")
                else
                  result = {:success => false}
                end
              else
                result = {:success => true}
              end

              render :json => result
            end
          rescue ErpTechSvcs::Utils::CompassAccessNegotiator::Errors::UserDoesNotHaveCapability=>ex
            render :json => {:success => false, :message => ex.message}
          end
        end

        def save_excerpt
          result = {:success => true}
          begin
            current_user.with_capability('edit_excerpt', 'Content') do
              id      = params[:id]
              html    = params[:html]
              content = Content.find(id)
              content.excerpt_html = html

              #TODO this should probably be moved into the view
              if content.altered?
                if content.save
                  unless params[:site_id].blank?
                    website = Website.find(params[:site_id])
                    content.publish(website, 'Auto Publish', content.version, current_user) if website.publish_on_save?
                  end
                else
                  result = {:success => false}
                end
              else
                result = {:success => true}
              end

              render :json => result
            end
          rescue ErpTechSvcs::Utils::CompassAccessNegotiator::Errors::UserDoesNotHaveCapability=>ex
            render :json => {:success => false, :message => ex.message}
          end
        end

      end#ContentController
    end#Desktop
  end#ErpApp
end#Knitkit
