module ErpWorkEffort
  module Extensions
    module ActiveRecord
      module ActsAsFacility

        def self.included(base)
          base.extend(ClassMethods)
        end

        module ClassMethods
          def acts_as_facility
            extend ActsAsFacility::SingletonMethods
            include ActsAsFacility::InstanceMethods

            after_initialize :initialize_facility
            after_create :save_facility
            after_update :save_facility
            after_destroy :destroy_facility

            has_one :facility, :as => :facility_record

            #Methods delegated to Facility
            [ :description,:description=,
            ].each { |m| delegate m, :to => :facility }
          end
        end

        module SingletonMethods
        end

        module InstanceMethods
          def root_asset
            self.facility
          end

          def save_facility
            self.facility.save
          end

          def initialize_facility
            if self.new_record? and self.facility.nil?
              f = Facility.new
              self.facility = f
              f.facility_record = self
            end
          end

          def destroy_facility
            self.facility.destroy if (self.facility && !self.facility.frozen?)
          end
        end

      end
    end
  end
end