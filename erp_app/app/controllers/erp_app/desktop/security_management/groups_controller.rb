module ErpApp
  module Desktop
    module SecurityManagement
      class GroupsController < ErpApp::Desktop::SecurityManagement::BaseController

        def available_setup
          begin
            columns = []
            columns << {header: 'Group Name', dataIndex: 'description', flex: 1}

            definition = []
            definition << {fieldLabel: 'Group Name', name: 'description'}
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
          sort = (params[:sort] || 'description').downcase
          sort = 'groups.description' if sort == 'description'
          dir = (params[:dir] || 'asc').downcase
          query_filter = params[:query_filter].strip rescue nil

          ar = assign_to_id.blank? ? Group : assign_to.constantize.find(assign_to_id).groups_not
          ar = (params[:query_filter].blank? ? ar : ar.where("UPPER(groups.description) LIKE UPPER('%#{query_filter}%')"))
          available = ar.paginate(:page => page, :per_page => per_page, :order => "#{sort} #{dir}")

          render :json => {:total => ar.count, :data => available.map { |x| {:description => x.description, :id => x.id} }}
        end

        def selected
          assign_to = params[:assign_to]
          assign_to_id = params[:id]
          sort = (params[:sort] || 'description').downcase
          sort = 'groups.description' if sort == 'description'
          dir = (params[:dir] || 'asc').downcase
          query_filter = params[:query_filter].strip rescue nil

          ar = assign_to_id.blank? ? Group : assign_to.constantize.find(assign_to_id).groups
          ar = (params[:query_filter].blank? ? ar : ar.where("UPPER(groups.description) LIKE UPPER('%#{query_filter}%')"))
          selected = ar.paginate(:page => page, :per_page => per_page, :order => "#{sort} #{dir}")

          render :json => {:total => ar.count, :data => selected.map { |x| {:description => x.description, :id => x.id} }}
        end

        def create
          begin
            description = params[:description].strip

            unless description.blank?
              Group.create(:description => params[:description])
              render :json => {:success => true, :message => 'Group created'}
            else
              raise "Group name blank"
            end
          rescue => ex
            Rails.logger.error ex.message
            Rails.logger.error ex.backtrace.join("\n")
            render :inline => {
                :success => false,
                :message => ex.message
            }.to_json
          end
        end

        def update
          begin
            description = params[:description].strip

            unless description.blank? or params[:id].blank?
              g = Group.find(params[:id])
              g.description = description
              g.save
              render :json => {:success => true, :message => 'Group updated'}
            else
              raise "Group name blank or no group ID"
            end
          rescue => ex
            Rails.logger.error ex.message
            Rails.logger.error ex.backtrace.join("\n")
            render :inline => {
                :success => false,
                :message => ex.message
            }.to_json
          end
        end

        def delete
          begin
            unless params[:id].blank?
              Group.destroy(params[:id])
              render :json => {:success => true, :message => 'Group deleted'}
            else
              raise "No Group ID"
            end
          rescue => ex
            Rails.logger.error ex.message
            Rails.logger.error ex.backtrace.join("\n")
            render :inline => {
                :success => false,
                :message => ex.message
            }.to_json
          end
        end

        def add
          begin
            assign_to = params[:assign_to]
            assign_to_id = params[:id]
            selected = JSON.parse(params[:selection])

            a = assign_to.constantize.find(assign_to_id)
            selected.each do |g|
              group = Group.find(g)
              case assign_to
                when 'User'
                  group.add_user(a)
                when 'SecurityRole'
                  group.add_role(a)
                when 'Capability'
                  group.add_capability(a)
              end
            end

            render :json => {:success => true, :message => 'Group(s) Added'}
          rescue => ex
            Rails.logger.error ex.message
            Rails.logger.error ex.backtrace.join("\n")
            render :inline => {
                :success => false,
                :message => ex.message
            }.to_json
          end
        end

        def remove
          begin
            assign_to = params[:assign_to]
            assign_to_id = params[:id]
            selected = JSON.parse(params[:selection])

            a = assign_to.constantize.find(assign_to_id)
            selected.each do |g|
              group = Group.find(g)
              case assign_to
                when 'User'
                  group.remove_user(a)
                when 'SecurityRole'
                  group.remove_role(a)
                when 'Capability'
                  group.remove_capability(a)
              end
            end

            render :json => {:success => true, :message => 'Group(s) Removed'}
          rescue => ex
            Rails.logger.error ex.message
            Rails.logger.error ex.backtrace.join("\n")
            render :inline => {
                :success => false,
                :message => ex.message
            }.to_json
          end
        end

        def effective_security
          begin
            assign_to_id = params[:id]
            u = Group.find(assign_to_id)

            render :json => {:success => true, :capabilities => u.class_capabilities_to_hash}
          rescue => ex
            Rails.logger.error ex.message
            Rails.logger.error ex.backtrace.join("\n")
            render :inline => {
                :success => false,
                :message => ex.message
            }.to_json
          end
        end

      end
    end
  end
end
