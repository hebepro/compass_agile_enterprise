module Api
  module V1
    class UsersController < BaseController

      def index
        username = params[:username]
        sort_hash = params[:sort].blank? ? {} : Hash.symbolize_keys(JSON.parse(params[:sort]).first)
        sort = sort_hash[:property] || 'username'
        dir = sort_hash[:direction] || 'ASC'
        limit = params[:limit] || 25
        start = params[:start] || 0

        if username.blank?
          users = User.order("#{sort} #{dir}").offset(start).limit(limit)
          total_count = User.count
        else
          users = User.where('username like ? or email like ?', "%#{username}%", "%#{username}%").order("#{sort} #{dir}").offset(start).limit(limit)
          total_count = users.count
        end

        render :json => {total_count: total_count, users: users.collect(&:to_data_hash)}
      end

      def reset_password
        begin
          login_url = params[:login_url].blank? ? ErpTechSvcs::Config.login_url : params[:login_url]
          login = params[:id].strip
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
          render :json => {:success => false, :message => 'Error sending email.'}
        end
      end

    end # UsersController
  end # V1
end # Api