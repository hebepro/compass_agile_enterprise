module ErpApp
  module Organizer
    module Tasks
      class BaseController < ::ErpApp::Organizer::BaseController

        def menu
          render :json => [{:text => 'Menu Item', :leaf => true, :iconCls => 'icon-note_pinned', :applicationCardId => "tasks_example_panel"}]
        end

      end #BaseController
    end #Tasks
  end #Organizer
end #ErpApp