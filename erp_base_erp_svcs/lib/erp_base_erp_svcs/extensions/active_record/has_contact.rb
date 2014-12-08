module ErpBaseErpSvcs
	module Extensions
		module ActiveRecord
			module HasContact
				def self.included(base)
				  base.extend(ClassMethods)
				end

				module ClassMethods
				  def has_contact
            extend HasContact::SingletonMethods
  					include HasContact::InstanceMethods
  					
					  after_initialize :initialize_contact
  					after_create :save_contact
  					after_update :save_contact
  					after_destroy :destroy_contact
					
					  has_one :contact, :as => :contact_mechanism
					  
					  [:purpose,
					    :purposes,
					    :is_primary,
					    :is_primary=,
					    :is_primary?].each { |m| delegate m, :to => :contact }
				  end
				end

				module SingletonMethods
				end

				module InstanceMethods
				  
				  def save_contact
					  self.contact.save
          end

          # return all contact purposes in one comma separated string
          def contact_purposes_to_s
            contact.contact_purposes.collect(&:description).join(', ')
          end

          # return all contact purpose iids in one comma separated string
          def contact_purpose_iids
            contact.contact_purposes.collect(&:internal_identifier).join(',')
          end

          # return all contact purposes
          def contact_purposes
            contact.contact_purposes
          end

				  def destroy_contact
					  self.contact.destroy unless self.contact.nil?
				  end

				  def initialize_contact
            if self.new_record? and self.contact.nil?
              self.contact = Contact.new
              self.contact.description = self.description
            end
          end
           
				end
				
			end #HasContact
		end #ActiveRecord
	end #Extensions
end #ErpBaseErpSvcs
