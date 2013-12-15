module ErpWorkEffort
  module ErpApp
    module Organizer
      module Tasks
        class WorkEffortsController < ::ErpApp::Organizer::BaseController

          def index
            offset = params[:offset] || 0
            limit = params[:limit] || 25

            work_efforts_statement = WorkEffort.work_efforts_for_party(current_user.party)

            total = work_efforts_statement.count
            work_efforts = work_efforts_statement.limit(limit).offset(offset)

            data = work_efforts.collect { |item| item.to_hash(
                :only => [
                    :description,
                    :created_at,
                    :current_status,
                    {:current_status_description => (TrackedStatusType.find_by_internal_identifier(item.current_status).description)}
                ])
            }

            render :json => {:success => true, :total => total, :work_efforts => data}
          end

        end #WorkEffortsController
      end #Tasks
    end #Organizer
  end #ErpApp
end #ErpWorkEffort
