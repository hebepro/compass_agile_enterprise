module Api
  module V1
    class SecurityRolesController < BaseController

      def index
        query = params[:query]
        sort_hash = params[:sort].blank? ? {} : Hash.symbolize_keys(JSON.parse(params[:sort]).first)
        sort = sort_hash[:property] || 'id'
        dir = sort_hash[:direction] || 'ASC'
        limit = params[:limit] || 25
        start = params[:start] || 0

        if query
          security_role_tbl = SecurityRole.arel_table
          statement = SecurityRole.where(security_role_tbl[:description].matches("%#{query}%")
                                                  .or(security_role_tbl[:internal_identifier].matches("%#{query}%")))

          total_count = statement.count
          security_roles = statement.order("#{sort} #{dir}").offset(start).limit(limit)
        else
          total_count = SecurityRole.count
          security_roles = SecurityRole.order("#{sort} #{dir}").offset(start).limit(limit)
        end

        render :json => {total_count: total_count, security_roles: security_roles.collect(&:to_data_hash)}
      end

    end # SecurityRolesController
  end # V1
end # Api