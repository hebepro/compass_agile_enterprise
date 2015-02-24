module ErpApp
  module Desktop
    module UserManagement
      class ApplicationManagementController < ErpApp::Desktop::UserManagement::BaseController

        def available_applications
          user_id = params[:user_id]
          desktop_applications = params[:desktop_applications].present?

          user = User.find(user_id)

          if desktop_applications
            current_applications = user.desktop_applications
            available_applications = if current_applications.empty?
                                       Application.desktop_applications.all
                                     else
                                       Application.desktop_applications.where("id not in (#{current_applications.collect(&:id).join(',')})")
                                     end

          else
            current_applications = user.apps
            available_applications = if current_applications.empty?
                                       Application.apps.all
                                     else
                                       Application.apps.where("id not in (#{current_applications.collect(&:id).join(',')})")
                                     end
          end

          render :json => available_applications.map { |application| {:text => application.description, :app_id => application.id, :iconCls => application.icon, :leaf => true} }
        end

        def current_applications
          user_id = params[:user_id]
          desktop_applications = params[:desktop_applications].present?

          user = User.find(user_id)

          current_applications = if desktop_applications
                                   user.desktop_applications
                                 else
                                   user.apps
                                 end

          render :json => current_applications.map { |application| {:text => application.description, :app_id => application.id, :iconCls => application.icon, :leaf => true} }
        end

        def save_applications
          app_ids = params[:app_ids]
          user_id = params[:user_id]
          desktop_applications = params[:desktop_applications].present?

          user = User.find(user_id)

          if desktop_applications
            user.desktop_applications = []
          else
            user.apps = []
          end

          unless app_ids.blank?
            app_ids.each do |app_id|
              if desktop_applications
                user.desktop_applications << Application.find(app_id)
              else
                user.apps << Application.find(app_id)
              end
            end
          end
          user.save

          render :json => {:success => true, :message => 'Application(s) Saved'}
        end

      end
    end
  end
end
