module ErpTechSvcs
  class UserController < ActionController::Base
    def activate
      login_url = params[:login_url].blank? ? ErpTechSvcs::Config.login_url : params[:login_url]
      if @user = User.load_from_activation_token(params[:activation_token])
        @user.activate!
        redirect_to login_url, :notice => 'User was successfully activated.'
      else
        redirect_to login_url, :notice => "Invalid activation token."
      end
    end

    def update_password
      if user = User.authenticate(current_user.username, params[:old_password])
        user.password_confirmation = params[:password_confirmation]
        if user.change_password!(params[:password])
          success = true
        else
          #### validation failed ####
          message = user.errors.full_messages
          success = false
        end
      else
        message = "Invalid current password."
        success = false
      end

      request.xhr? ? (render :json => {:success => success, :message => message}) : (render :text => message)
    end

    def reset_password
      begin
        login_url = params[:login_url].blank? ? ErpTechSvcs::Config.login_url : params[:login_url]
        login = params[:login].strip
        if user = (User.where('username = ? or email = ?', login, login)).first

          # generate new password with only letters
          charset = %w{ A C D E F G H J K M N P Q R T V W X Y Z }
          new_password = (0...8).map{ charset.to_a[rand(charset.size)] }.join

          user.password_confirmation = new_password
          if user.change_password!(new_password)
            user.add_instance_attribute(:login_url, login_url)
            user.add_instance_attribute(:domain, params[:domain])
            user.deliver_reset_password_instructions!
            message = "Password has been reset.  An email has been sent with further instructions to #{user.email}."
            success = true
          else
            message = "Error re-setting password."
            success = false
          end
        else
          message = "Invalid user name or email address."
          success = false
        end
        render :json => {:success => success, :message => message}
      rescue => ex
        Rails.logger.error ex.message
        Rails.logger.error ex.backtrace.join("\n")

        ExceptionNotifier.notify_exception(ex) if defined? ExceptionNotifier

        render :json => {:success => false, :message => 'Error sending email.'}
      end
    end


  end #UserController
end #ErpTechSvcs
