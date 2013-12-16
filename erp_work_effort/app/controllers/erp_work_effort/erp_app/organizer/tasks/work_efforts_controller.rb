module ErpWorkEffort
  module ErpApp
    module Organizer
      module Tasks
        class WorkEffortsController < ::ErpApp::Organizer::BaseController

          def role_types
            data = RoleType.iid('task_master').self_and_descendants.collect{|item| item.to_hash(:only => [:id, :description])}

            render :json => {success: true, role_types: data}
          end

          def work_effort_types
            data = WorkEffortType.all.collect{|item| item.to_hash(:only => [:id, :description])}

            render :json => {success: true, work_effort_types: data}
          end

          def index
            offset = params[:offset] || 0
            limit = params[:limit] || 25
            party = params[:party_id].blank? ? nil : Party.find(params[:party_id])

            if party
              work_efforts_statement = WorkEffort.work_efforts_for_party(current_user.party)
            else
              work_efforts_statement = WorkEffort
            end

            total = work_efforts_statement.count
            work_efforts = work_efforts_statement.limit(limit).offset(offset)

            data = work_efforts.collect { |item| item.to_hash(
                :only => [
                    :id,
                    :description,
                    :created_at,
                    :current_status,
                    ],
                :current_status_description => (TrackedStatusType.find_by_internal_identifier(item.current_status).description),
                :assigned_parties => item.assigned_parties,
                :assigned_roles => item.assigned_roles
              )
            }

            render :json => {:success => true, :total => total, :work_efforts => data}
          end

          def create
            result = {}

            begin
              ActiveRecord::Base.transaction do
                estimated_completion_time = params[:estimated_completion_time].to_i
                description = params[:description].strip
                work_effort_type_id = params[:work_effort_type]

                work_effort_type = WorkEffortType.find(work_effort_type_id)

                work_effort = WorkEffort.new
                work_effort.work_effort_type = work_effort_type
                work_effort.description = description
                work_effort.projected_completion_time = estimated_completion_time
                work_effort.save

                work_effort.current_status = 'pending'

                unless params[:assignment_type_role].blank?
                  role_type = RoleType.find(params[:role_type])

                  work_effort.role_types << role_type

                end

                unless params[:assignment_type_party].blank?
                  party = Party.find(params[:assigned_party_id])

                  work_effort_party_assignment = WorkEffortPartyAssignment.new
                  work_effort_party_assignment.party = party
                  work_effort_party_assignment.role_type = RoleType.iid('worker')

                  work_effort.work_effort_party_assignments << work_effort_party_assignment
                end

                work_effort.save

                result = {:success => true, :message => "Task Added"}

              end
            rescue Exception => ex
              Rails.logger.error ex.message
              Rails.logger.error ex.backtrace.join("\n")
              result = {:success => false, :message => "Error adding task"}
            end

            render :json => result
          end

          def destroy
            work_effort = WorkEffort.find(params[:id])

            render :json => {:success => work_effort.destroy}
          end

        end #WorkEffortsController
      end #Tasks
    end #Organizer
  end #ErpApp
end #ErpWorkEffort
