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

          def task_count
            party = params[:party_id].blank? ? nil : Party.find(params[:party_id])

            if party
              work_efforts_statement = WorkEffort.work_efforts_for_party(party, 'pending')
            else
              work_efforts_statement = WorkEffort.work_efforts_for_party(current_user.party, 'pending')
            end

            count = work_efforts_statement.count

            render :json => {success: true, count: count}
          end

          def projects
            projects = WorkEffort.joins(:work_effort_type).where('work_effort_types.internal_identifier = ?', 'project').all

            render :json => {success: true, projects: projects.collect{|project| project.to_hash(:only => [:description, :id])}}
          end

          def tasks
            tasks = WorkEffort.joins(:work_effort_type).where('work_effort_types.internal_identifier = ?', 'task').all

            render :json => {success: true, tasks: tasks.collect{|task| task.to_hash(:only => [:description, :id])}}
          end

          def index
            offset = params[:offset] || 0
            limit = params[:limit] || 25
            party = params[:party_id].blank? ? nil : Party.find(params[:party_id])
            all_tasks = params[:all_tasks].blank? ? false : true

            #if all_tasks
              work_efforts_statement = WorkEffort
            #elsif party
            #  work_efforts_statement = WorkEffort.work_efforts_for_party(party)
            #else
            #  work_efforts_statement = WorkEffort.work_efforts_for_party(current_user.party)
            #end

            total = work_efforts_statement.count
            work_efforts = work_efforts_statement.limit(limit).offset(offset)

            work_efforts.sort!

            data = work_efforts.sort.collect { |item| item.to_hash(

                :only => [
                    :id,
                    :description,
                    :created_at,
                    :current_status,
                    ],
                :current_status_description => (TrackedStatusType.find_by_internal_identifier(item.current_status).description),
                :assigned_parties => item.assigned_parties,
                :assigned_roles => item.assigned_roles,
                :project => item.project.nil? ? nil : item.project.description
              )
            }

            render :json => {:success => true, :total => total, :work_efforts => data}
          end

          def create
            result = {}

            begin
              ActiveRecord::Base.transaction do
                start_date = Date.strptime(params[:start_date], '%m/%d/%Y')
                end_date = Date.strptime(params[:end_date], '%m/%d/%Y')
                estimated_completion_time = params[:estimated_completion_time].to_i
                description = params[:description].strip

                work_effort = WorkEffort.new
                work_effort.work_effort_type = WorkEffortType.find_by_internal_identifier('task')
                work_effort.description = description
                work_effort.projected_completion_time = estimated_completion_time
                work_effort.start_date = start_date
                work_effort.end_date = end_date
                work_effort.save

                work_effort.current_status = 'pending'

                # check for project
                unless params[:project].blank?
                  project = WorkEffort.find(params[:project])

                  work_effort.move_to_child_of(project)
                end

                # check for parent task
                unless params[:parent_task].blank?
                  parent_task = WorkEffort.find(params[:parent_task])

                  work_effort.move_to_child_of(parent_task)
                end

                # check for dependencies
                unless params[:dependency].blank?
                  dependency_assoc_type = WorkEffortAssociationType.find_by_internal_identifier('dependency')
                  dependent_task = WorkEffort.find(params[:dependency])

                  WorkEffortAssociation.create(
                      work_effort_from: dependent_task,
                      work_effort_to: work_effort,
                      work_effort_association_type: dependency_assoc_type
                  )

                end

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
