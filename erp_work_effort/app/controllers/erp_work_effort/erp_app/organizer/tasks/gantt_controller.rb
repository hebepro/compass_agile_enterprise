module ErpWorkEffort
  module ErpApp
    module Organizer
      module Tasks
        class GanttController < ::ErpApp::Organizer::BaseController

          def gantt_tasks

            data = []

            root_work_effort = WorkEffort.root
            work_effort_hash = {
                Id: root_work_effort.id,
                leaf: false,
                Name: root_work_effort.description,
                StartDate: root_work_effort.start_date,
                Duration: root_work_effort.duration,
                expanded: true,
                PercentDone: 0,
                cls: 'Sencha',
                tasks: []
            }

            data << work_effort_hash

            root_work_effort.children.each do |work_effort|
              work_effort_hash[:tasks].push(
                  {
                      Id: work_effort.id,
                      leaf: true,
                      Name: work_effort.description,
                      StartDate: work_effort.start_date,
                      Duration: work_effort.duration,
                      expanded: true,
                      PercentDone: 0,
                      cls: 'Sencha'
                  }
              )
            end

            render :json => {:success => true, :tasks => data}
          end

          def gantt_dependencies
            data = []

            root_work_effort = WorkEffort.root

            root_work_effort.children.each do |work_effort|
              work_effort.from_work_effort_associations.each do |association|
                data << {
                    From: association.work_effort_from.id,
                    To: association.work_effort_to.id,
                    Type: 2
                }
              end
            end

            render :json => {:success => true, :dependencies => data}
          end

        end
      end # Tasks
    end #Organizer
  end #ErpApp
end #ErpWorkEffortend
