module ErpWorkEffort
  module Extensions
    module ActiveRecord
      module ActsAsWorkEffort
        
        def self.included(base)
          base.extend(ClassMethods)
        end

        module ClassMethods
          def acts_as_work_effort
            extend ActsAsWorkEffort::SingletonMethods
            include ActsAsWorkEffort::InstanceMethods
        
            after_initialize :new_work_effort
            after_update     :save_work_effort
            after_save       :save_work_effort
            after_destroy    :destroy_work_effort
        
            has_one :work_effort, :as => :work_effort_record
        
            [
              :description,
              :description=,
              :facility, 
              :facility=,
              :work_effort_assignments,
              :work_effort_statuses,
              :projected_cost,
              :projected_cost=,
              :projected_completion_time,
              :projected_completion_time=,
              :actual_cost,
              :start,
              :started?,
              :completed?,
              :send_to_status
            ].each do |m| 
              delegate m, :to => :work_effort 
            end        
          end
        end

        module SingletonMethods
        end

        module InstanceMethods
          def save_work_effort
            self.work_effort.save
          end

          def destroy_work_effort
            self.work_effort.destroy
          end

          def new_work_effort
            if self.new_record? and self.work_effort.nil?
              work_effort = WorkEffort.new
              self.work_effort = work_effort
              work_effort.work_effort_record = self
            end
          end
        end
      end
    end
  end
end
