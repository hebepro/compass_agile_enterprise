module ErpApp
  module Organizer
    class ApplicationManagementController < BaseController

      def current_user_applications
        user = current_user

        node_hashes = []
        organizer = user.organizer
        organizer.applications.joins(:preference_types).uniq.each do |application|
          node_hashes << {:text => application.description, :iconCls => application.icon, :leaf => true, :id => application.id}
        end

        render :json => node_hashes
      end

      def setup
        application_id = params[:id]
        application = Application.find(application_id)

        render :inline => "{\"success\":true, \"preference_types\":#{application.preference_types.to_json(:methods => [:default_value], :include => :preference_options)}}"
      end

      def preferences
        application_id = params[:id]
        user = current_user
        application = Application.find(application_id)

        render :inline => "{\"success\":true, \"preferences\":#{application.preferences(user).to_json(:include => [:preference_type, :preference_option])}}"
      end

      def update
        application_id = params[:id]
        user = current_user

        application = Application.find(application_id)
        params.each do |k, v|
          application.set_user_preference(user, k, v) unless (k.to_s == 'action' or k.to_s == 'controller' or k.to_s == 'id' or k.to_s == 'authenticity_token')
        end
        application.save

        render :inline => "{\"success\":true, \"description\":'#{application.description}', \"shortcutId\":'#{application.shortcut_id}', \"shortcut\":'#{application.get_user_preference(user, :desktop_shortcut)}', \"preferences\":#{application.preferences(user).to_json(:include => [:preference_type, :preference_option])}}"
      end

    end #ApplicationManagementController
  end #Organizer
end #ErpApp