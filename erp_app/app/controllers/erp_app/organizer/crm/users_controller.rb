module ErpApp
  module Organizer
    module Crm
      class UsersController < ErpApp::Organizer::BaseController

        def index
          render :json => if request.get?
                            get_users
                          elsif request.post?
                            create_user
                          elsif request.put?
                            update_user
                          elsif request.delete?
                            delete_user
                          end
        end

        protected

        def get_users
          party = Party.find(params[:party_id])
          offset = params[:offset] || 0
          limit = params[:limit] || 25
          query_filter = params[:query_filter] || nil

          user_table = User.arel_table

          statement = party.users

          if query_filter
            statement = statement.where(user_table[:username].matches("%#{query_filter}%")
                                        .or(user_table[:email].matches("%#{query_filter}%")))
          end

          total = statement.count
          users = statement.limit(limit).offset(offset).all

          {:success => true,
           :users => users.collect { |user| user.to_hash(:only =>
                                                             [:id, :username,
                                                              :email,
                                                              :last_login_at,
                                                              :created_at,
                                                              :updated_at,
                                                              :activation_state])
           },
           :total => total}
        end

        def create_user
          result = {}
          party = Party.find(params[:party_id])

          ActiveRecord::Base.transaction do
            begin
              # begin and end with a letter
              temp_password = 'AB' + SecureRandom.uuid[0..5] + 'CD'

              user = User.new(
                  :email => params[:data]['email'].strip,
                  :username => params[:data]['username'].strip,
                  :password => temp_password,
                  :password_confirmation => temp_password
              )
              #set this to tell activation where to redirect_to for login and temp password
              user.add_instance_attribute(:login_url, '/erp_app/login')
              user.add_instance_attribute(:temp_password, temp_password)

              user.party = party

              if user.save
                result = {:success => user.save, :users => user.to_hash(:only =>
                                                                           [:id, :username,
                                                                            :email,
                                                                            :last_login_at,
                                                                            :created_at,
                                                                            :updated_at,
                                                                            :activation_state])}
              else
                result = {:success => false, :message => user.errors.full_messages.to_sentence}
              end

            rescue Exception => ex
              Rails.logger.error ex.message
              Rails.logger.error ex.backtrace.join("\n")

              result = {:success => false, :message => "Error adding #{party_type}"}
            end
          end

          result
        end

        def update_user
          user = User.find(params[:id])

          user.username = params[:data][:username].strip
          user.email = params[:data][:email].strip

          if user.save
            result = {:success => user.save, :users => user.to_hash(:only =>
                                                                        [:id, :username,
                                                                         :email,
                                                                         :last_login_at,
                                                                         :created_at,
                                                                         :updated_at,
                                                                         :activation_state])}
          else
            result = {:success => false, :message => user.errors.full_messages.to_sentence}
          end

          result
        end

        def delete_user
          user = User.find(params[:id])

          {:success => user.destroy}
        end

      end #BaseController
    end #Crm
  end #Organizer
end #ErpApp