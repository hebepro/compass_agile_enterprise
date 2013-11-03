module ErpApp
  module Organizer
    module Crm
      class ContactMechanismController < ErpApp::Organizer::BaseController

        def contact_purposes
          render :inline => "{\"types\":#{ContactPurpose.all.to_json(:only => [:id, :description])}}"
        end

        def index
          render :json => if request.post?
                            create_contact_mechanism
                          elsif request.put?
                            update_contact_mechanism
                          elsif request.get?
                            get_contact_mechanisms
                          elsif request.delete?
                            delete_contact_mechanism
                          end
        end

        def send_email
          send_to = params[:send_to].strip
          subject = params[:subject].strip
          message = params[:message].strip
          cc_email = params[:cc_email].blank? ? nil : params[:cc_email].strip

          CrmMailer.send_message(send_to, subject, message).deliver

          if cc_email
            CrmMailer.send_message(cc_email, subject, message).deliver
          end

          render :json => {:success => true}
        end

        protected

        def create_contact_mechanism
          party_id = params[:party_id]
          contact_type = params[:contact_type]
          contact_purpose_id = params[:data][:contact_purpose_id]
          params[:data].delete(:contact_purpose_id)

          contact_mechanism_class = contact_type.constantize
          party = Party.find(party_id)

          contact_purpose = contact_purpose_id.blank? ? ContactPurpose.find_by_internal_identifier('default') : ContactPurpose.find(contact_purpose_id)
          contact_mechanism = party.add_contact(contact_mechanism_class, params[:data], contact_purpose)

          contact_mechanism_class.class_eval do
            def contact_purpose_id
              self.contact_purpose ? contact_purpose.id : nil
            end
          end

          "{\"success\":true, \"data\":#{contact_mechanism.to_json(:methods => [:contact_purpose_id])},\"message\":\"#{contact_type} added\"}"
        end

        def update_contact_mechanism
          contact_type = params[:contact_type]
          contact_mechanism_id = params[:data][:id]
          contact_purpose_id = params[:data][:contact_purpose_id]
          params[:data].delete(:id)
          params[:data].delete(:contact_purpose_id)

          contact_mechanism = contact_type.constantize.find(contact_mechanism_id)

          if !contact_purpose_id.blank?
            contact_purpose = ContactPurpose.find(contact_purpose_id)
            contact_mechanism.contact.contact_purposes.destroy_all
            contact_mechanism.contact.contact_purposes << contact_purpose
            contact_mechanism.contact.save
          end

          params[:data].each do |key, value|
            method = key + '='
            contact_mechanism.send method.to_sym, value
          end

          contact_mechanism.save

          contact_type.constantize.class_eval do
            def contact_purpose_id
              self.contact_purpose ? contact_purpose.id : nil
            end
          end

          "{\"success\":true, \"data\":#{contact_mechanism.to_json(:methods => [:contact_purpose_id])},\"message\":\"#{contact_type} updated\"}"
        end

        def get_contact_mechanisms
          party_id = params[:party_id]
          contact_type = params[:contact_type]

          contact_mechanism_class = contact_type.constantize

          party = Party.find(party_id)
          contact_mechanisms = party.find_all_contacts_by_contact_mechanism(contact_mechanism_class)

          contact_mechanism_class.class_eval do
            def contact_purpose_id
              self.contact_purpose ? contact_purpose.id : nil
            end
          end

          "{\"success\":true, \"data\":#{contact_mechanisms.to_json(:methods => [:contact_purpose_id])}}"
        end

        def delete_contact_mechanism
          party_id = params[:party_id]
          contact_type = params[:contact_type]
          contact_mechanism_id = params[:id]

          contact_type_class = contact_type.constantize
          contact_mechanism = contact_type_class.find(contact_mechanism_id)
          contact_mechanism.destroy

          party = Party.find(party_id)
          contact_mechanisms = party.find_all_contacts_by_contact_mechanism(contact_type_class)

          "{\"success\":true, \"data\":#{contact_mechanisms.to_json(:methods => [:contact_purpose_id])},\"message\":\"#{contact_type} deleted\"}"
        end

      end #BaseController
    end #Crm
  end #Organizer
end #ErpApp