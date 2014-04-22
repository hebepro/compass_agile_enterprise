module Knitkit
  module ErpApp
    module Desktop
      class PositionController < Knitkit::ErpApp::Desktop::AppController

        def change_section_parent
          begin
            current_user.with_capability('drag_item', 'WebsiteTree') do

              new_parent = WebsiteSection.where('id = ?', params[:parent_id]).first
              website_section = WebsiteSection.find(params[:section_id])

              if new_parent
                website_section.move_to_child_of(new_parent)
              else
                website_section.move_to_root
              end

              render :json => {:success => true}

            end
          rescue ErpTechSvcs::Utils::CompassAccessNegotiator::Errors::UserDoesNotHaveCapability => ex
            render :json => {:success => false, :message => ex.message}
          end
        end

        def update_section_position
          begin
            current_user.with_capability('drag_item', 'WebsiteTree') do

              params[:position_array].each do |position|
                model = WebsiteSection.find(position['id'])
                model.position = position['position'].to_i
                model.save
              end

              render :json => {:success => true}

            end
          rescue ErpTechSvcs::Utils::CompassAccessNegotiator::Errors::UserDoesNotHaveCapability => ex
            render :json => {:success => false, :message => ex.message}
          end
        end

        def update_article_position
          begin
            current_user.with_capability('drag_item', 'WebsiteTree') do

              website_section = WebsiteSection.find(params[:section_id])

              params[:position_array].each do |position|
                model = website_section.website_section_contents.where('content_id = ?', position['id']).first
                model.position = position['position'].to_i
                model.save
              end

              render :json => {:success => true}

            end
          rescue ErpTechSvcs::Utils::CompassAccessNegotiator::Errors::UserDoesNotHaveCapability => ex
            render :json => {:success => false, :message => ex.message}
          end
        end

      end #PositionController
    end #Desktop
  end #ErpApp
end #Knitkit

