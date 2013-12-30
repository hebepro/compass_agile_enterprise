module ErpApp
  module Organizer
    module InventoryMgt
      class BaseController < ::ErpApp::Organizer::BaseController

        def menu
          render :json => [{:text => 'Menu Item', :leaf => true, :iconCls => 'icon-tasks', :applicationCardId => "inventory_mgt_example_panel"}]
        end

      end #BaseController
    end #InventoryMgt
  end #Organizer
end #ErpApp