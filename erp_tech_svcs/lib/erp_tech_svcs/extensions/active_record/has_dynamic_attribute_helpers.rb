module ErpTechSvcs
  module Extensions
    module ActiveRecord
      module HasDynamicAttributeHelpers

        def self.included(base)
          base.extend(ClassMethods)
        end

        module ClassMethods

          def has_dynamic_attribute_helpers(options={:dynamic_attribute_prefix => 'dyn_'})
            cattr_accessor :dynamic_attribute_prefix
            self.dynamic_attribute_prefix = options[:dynamic_attribute_prefix]

            extend HasDynamicAttributeHelpers::SingletonMethods
            include HasDynamicAttributeHelpers::InstanceMethods
          end

        end

        module SingletonMethods
          def add_dyn_prefix(field)
            "#{self.dynamic_attribute_prefix}#{field}"
          end

          def remove_dyn_prefix(field)
            field.gsub(self.dynamic_attribute_prefix, '')
          end
        end

        module InstanceMethods

          def get_dyn_attribute(field)
            self.send("#{self.class.add_dyn_prefix(field)}")
          end

          def set_dyn_attribute(field, value)
            self.send("#{self.class.add_dyn_prefix(field)}=", value)
          end

          def sanatize_dyn_attributes
            {}.tap do |hash|

              self.dynamic_attributes.collect do |k, v|
                hash[self.class.remove_dyn_prefix(k)] = v
              end

            end
          end

        end

      end #HasDynamicAttributeHelpers
    end #ActiveRecord
  end #Extensions
end #ErpTechSvcs

