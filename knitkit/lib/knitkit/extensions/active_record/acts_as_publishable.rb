module Knitkit
  module Extensions
    module ActiveRecord
      module ActsAsPublishable
        def self.included(base)
          base.extend(ClassMethods)
        end

        module ClassMethods

          def can_be_published
            after_destroy :delete_published_elements

            extend ActsAsPublishable::SingletonMethods
            include ActsAsPublishable::InstanceMethods
          end

        end

        module SingletonMethods
        end

        module InstanceMethods
          def publish(site, comment, version, current_user)
            site.publish_element(comment, self, version, current_user)
          end

          def delete_published_elements
            PublishedElement.delete_all("published_element_record_id = '#{id}' and (published_element_record_type = '#{self.class.to_s}' or published_element_record_type = '#{self.class.superclass.to_s}')")
          end
        end

      end #ActsAsPublishable
    end #ActiveRecord
  end #Extensions
end #Knitkit
