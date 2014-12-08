module ErpApp
  module Desktop
    module SecurityManagement
      class UsersController < ErpApp::Desktop::SecurityManagement::BaseController

        def available_setup
          begin
            columns = []
            columns << {header: 'Party Description', dataIndex: 'party_description', flex: 1}
            columns << {header: 'Username', dataIndex: 'username', flex: 1}
            columns << {header: 'Email', dataIndex: 'email', flex: 1}

            definition = []
            definition << {fieldLabel: 'Party Description', name: 'party_description'}
            definition << {fieldLabel: 'Username', name: 'username'}
            definition << {fieldLabel: 'Email', name: 'email'}
            definition << {fieldLabel: 'ID', name: 'id'}

            render :json => {success: true, columns: columns, fields: definition}

          rescue => ex
            Rails.logger.error ex.message
            Rails.logger.error ex.backtrace.join("\n")

            render :json => {success: false, message: ex.message}
          end
        end

        def selected_setup
          available_setup
        end

        def available
          assign_to = params[:assign_to]
          assign_to_id = params[:id]
          sort = (params[:sort] || 'username').downcase
          dir = (params[:dir] || 'asc').downcase
          query_filter = params[:query_filter].strip rescue nil

          ar = assign_to_id.blank? ? User : assign_to.constantize.find(assign_to_id).users_not
          ar = params[:query_filter].blank? ? ar : ar.where("UPPER(username) LIKE UPPER('%#{query_filter}%') OR UPPER(email) LIKE UPPER('%#{query_filter}%') ")
          available = ar.paginate(:page => page, :per_page => per_page, :order => "#{sort} #{dir}")

          render :json => {:total => ar.count, :data => available.map { |x| {:username => x.username, :email => x.email, :party_description => x.party.description, :id => x.id} }}
        end

        def selected
          assign_to = params[:assign_to]
          assign_to_id = params[:id]
          sort = (params[:sort] || 'username').downcase
          dir = (params[:dir] || 'asc').downcase
          query_filter = params[:query_filter].strip rescue nil

          ar = assign_to_id.blank? ? User : assign_to.constantize.find(assign_to_id).users
          ar = (params[:query_filter].blank? ? ar : ar.where("UPPER(username) LIKE UPPER('%#{query_filter}%') OR UPPER(email) LIKE UPPER('%#{query_filter}%') "))
          selected = ar.paginate(:page => page, :per_page => per_page, :order => "#{sort} #{dir}")

          render :json => {:total => ar.count, :data => selected.map { |x| {:username => x.username, :email => x.email, :party_description => x.party.description, :id => x.id} }}
        end

        def add
          begin
            assign_to = params[:assign_to]
            assign_to_id = params[:id]
            selected = JSON.parse(params[:selection])

            a = assign_to.constantize.find(assign_to_id)
            selected.each do |x|
              u = User.find(x)
              case assign_to
                when 'Group'
                  a.add_user(u)
                when 'SecurityRole'
                  u.add_role(a)
                when 'Capability'
                  u.add_capability(a)
              end
            end

            render :json => {:success => true, :message => 'Group(s) Added'}
          rescue Exception => e
            Rails.logger.error e.message
            Rails.logger.error e.backtrace.join("\n")
            render :inline => {
                :success => false,
                :message => e.message
            }.to_json
          end
        end

        def remove
          begin
            assign_to = params[:assign_to]
            assign_to_id = params[:id]
            selected = JSON.parse(params[:selection])

            a = assign_to.constantize.find(assign_to_id)
            selected.each do |x|
              u = User.find(x)
              case assign_to
                when 'Group'
                  a.remove_user(u)
                when 'SecurityRole'
                  u.remove_role(a)
                when 'Capability'
                  u.remove_capability(a)
              end
            end

            render :json => {:success => true, :message => 'Group(s) Removed'}
          rescue Exception => e
            Rails.logger.error e.message
            Rails.logger.error e.backtrace.join("\n")
            render :inline => {
                :success => false,
                :message => e.message
            }.to_json
          end
        end

        def effective_security
          begin
            assign_to_id = params[:id]
            u = User.find(assign_to_id)

            render :json => {:success => true, :roles => u.all_uniq_roles, :capabilities => u.class_capabilities_to_hash}
          rescue Exception => e
            Rails.logger.error e.message
            Rails.logger.error e.backtrace.join("\n")
            render :inline => {
                :success => false,
                :message => e.message
            }.to_json
          end
        end

      end
    end
  end
end
