module Api
  module V1
    class RoleTypesController < BaseController

      def index
        if params[:parent]
          parent = nil
          # create parent if it doesn't exist
          # if the parent param is a comma seperated string then
          # the parent is nested from left to right
          params[:parent].split(',').each do |parent_iid|
            if parent
              parent = RoleType.find_or_create(parent_iid, params[:parent].humanize, parent)
            else
              parent = RoleType.find_or_create(parent_iid, params[:parent].humanize)
            end
          end
          role_types = parent.children.all.collect { |role| role.to_hash(:only => [:description, :internal_identifier]) }
        else
          role_types = RoleType.all.collect { |role| role.to_hash(:only => [:description, :internal_identifier]) }
        end

        render :json => {success: true, role_types: role_types}
      end

    end # RoleTypesController
  end # V1
end # Api