module ErpTechSvcs
  module Extensions
    module ActiveRecord
      module ScopedBy

        module Errors
        end

        def self.included(base)
          base.extend(ClassMethods)
        end

        module ClassMethods

          def add_scoped_by(attr_name)
            # serialize Scope attributes
            is_json attr_name

            extend SingletonMethods
            include InstanceMethods

            # create method to initialize the json field with an empty hash
            define_method("initialize_#{attr_name}_scoped_by_json") do
              if self.new_record?
                send("#{attr_name}=", {})
              end
            end
            after_initialize "initialize_#{attr_name}_scoped_by_json"
          end

        end

        module SingletonMethods
          def scoped_by(scope_name, scope_value)
            if ::ActiveRecord::Base.connection.instance_values["config"][:adapter] == 'postgresql'
              where("(#{self.table_name}.scoped_by @> '\"#{scope_name}\"=>\"#{scope_value}\"'::hstore )")
            else
              where(arel_table[:scoped_by].matches("%\"#{scope_name}\":\"#{scope_value}\"%")
                    .or(arel_table[:scoped_by].matches("%\"#{scope_name}\":#{scope_value}%")))
            end
          end
        end

        module InstanceMethods
          def add_scope(scope_name, scope_value)
            scoped_by[scope_name.to_s] = scope_value
            save
          end

          def remove_scope(scope_name)
            scoped_by[scope_name.to_s] = nil
            save
          end

          def get_scope(scope_name)
            scoped_by[scope_name.to_s]
          end
        end

      end # ScopedBy
    end # ActiveRecord
  end # Extensions
end # ErpTechSvcs

