module ErpWorkEffort
  module ErpApp
    module Organizer
      module Tasks
        class GanttController < ::ErpApp::Organizer::BaseController

          def gantt_tasks
            data = [
                {
                    id: 1,
                    leaf: false,
                    Name: 'DriverBuddy',
                    StartDate: Date.today,
                    Duration: 7,
                    expanded: true,
                    PercentDone: 0,
                    cls: 'Sencha',
                    tasks: [
                        {
                            id: 2,
                            leaf: true,
                            Name: 'Setup Website',
                            StartDate: Date.today,
                            Duration: 7,
                            expanded: true,
                            PercentDone: 0,
                            cls: 'Sencha'
                        },
                        {
                            id: 3,
                            leaf: true,
                            Name: 'Setup CRM',
                            StartDate: (Date.today + 7.days),
                            Duration: 7,
                            expanded: true,
                            PercentDone: 0,
                            cls: 'Sencha'
                        }
                    ]
                }
            ]

            render :json => {:success => true, :tasks => data}
          end

          def gantt_dependencies
            data = []

            render :json => {:success => true, :dependencies => data}
          end

        end
      end # Tasks
    end #Organizer
  end #ErpApp
end #ErpWorkEffortend
