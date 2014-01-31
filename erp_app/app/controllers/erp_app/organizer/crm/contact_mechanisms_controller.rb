module ErpApp
  module Organizer
    module Crm
      class ContactMechanismsController < ErpApp::Organizer::BaseController

        def contact_purposes
          render :json => {success: true, types: ContactPurpose.all.collect(&:to_hash)}
        end

        def states
          country_id = 223

          states = GeoZone.find_all_by_geo_country_id(country_id)

          data = states.collect do |item|
            {state: item.zone_name, geo_zone_code: item.zone_code}
          end

          render :json => {:success => true, :states => data}
        end

        def index
          party_id = params[:party_id]
          contact_type = params[:contact_type]

          contact_mechanism_class = contact_type.constantize

          party = Party.find(party_id)
          contact_mechanisms = party.find_all_contacts_by_contact_mechanism(contact_mechanism_class)

          contact_mechanisms.sort_by! { |item| item.is_primary <=> item.is_primary }.reverse!

          data = contact_mechanisms.collect do |contact_mechanism|
            contact_mechanism.to_hash({
                                          contact_purpose_id: (contact_mechanism.contact_purpose_id),
                                          is_primary: (contact_mechanism.is_primary),
                                      })
          end

          render :json => {success: true, data: data}
        end

        def create
          party_id = params[:party_id]
          contact_type = params[:contact_type]
          contact_purpose_id = params[:contact_purpose_id]

          params[:is_primary] = (params[:is_primary] == 'on') ? true : nil

          #remove additional attributes
          params.delete(:action)
          params.delete(:controller)
          params.delete(:authenticity_token)
          params.delete(:party_id)
          params.delete(:contact_type)
          params.delete(:contact_purpose_id)

          contact_mechanism_class = contact_type.constantize
          party = Party.find(party_id)

          contact_purpose = contact_purpose_id.blank? ? ContactPurpose.find_by_internal_identifier('default') : ContactPurpose.find(contact_purpose_id)
          contact_mechanism = party.add_contact(contact_mechanism_class, params, contact_purpose)

          data = contact_mechanism.to_hash({
                                               contact_purpose_id: (contact_mechanism.contact_purpose_id),
                                               is_primary: (contact_mechanism.is_primary),
                                           })

          render :json => {success: true, data: data, message: "#{contact_type} added"}

        end

        def update
          party_id = params[:party_id]
          contact_type = params[:contact_type]
          contact_mechanism_id = params[:id]
          contact_purpose_id = params[:contact_purpose_id]

          params[:is_primary] = (params[:is_primary] == 'on') ? true : nil

          #remove additional attributes

          params.delete(:action)
          params.delete(:controller)
          params.delete(:authenticity_token)
          params.delete(:id)
          params.delete(:party_id)
          params.delete(:contact_type)
          params.delete(:contact_purpose_id)
          params.delete(:updated_at)
          params.delete(:created_at)

          contact_mechanism = contact_type.constantize.find(contact_mechanism_id)

          contact_purpose = ContactPurpose.find(contact_purpose_id)
          contact_mechanism.contact.contact_purposes.destroy_all
          contact_mechanism.contact.contact_purposes << contact_purpose
          contact_mechanism.contact.save

          party = Party.find(party_id)
          party.update_contact_with_purpose(contact_type.constantize, contact_purpose, params)

          data = contact_mechanism.to_hash({
                                               contact_purpose_id: (contact_mechanism.contact_purpose_id),
                                               is_primary: (contact_mechanism.is_primary),
                                           })


          render :json => {success: true, data: data, message: "#{contact_type} updated"}

        end

        def destroy
          party_id = params[:party_id]
          contact_type = params[:contact_type]
          contact_mechanism_id = params[:id]

          contact_type_class = contact_type.constantize
          contact_mechanism = contact_type_class.find(contact_mechanism_id)
          contact_mechanism.destroy

          party = Party.find(party_id)
          contact_mechanisms = party.find_all_contacts_by_contact_mechanism(contact_type_class)

          data = contact_mechanisms.collect do |_contact_mechanism_|
            _contact_mechanism_.to_hash({
                                            contact_purpose_id: (contact_mechanism.contact_purpose_id),
                                            is_primary: (contact_mechanism.is_primary),
                                        })
          end

          render :json => {success: true, data: data, message: "#{contact_type} deleted"}
        end

        def send_email
          send_to = EmailAddress.find(params[:id])

          subject = params[:subject].strip
          message = params[:message].strip
          cc_email = params[:cc_email].blank? ? nil : params[:cc_email].strip

          CrmMailer.send_message(send_to.email_address, subject, message).deliver

          CrmMailer.send_message(cc_email, subject, message).deliver if cc_email

          render :json => {:success => true}
        end

      end #BaseController
    end #Crm
  end #Organizer
end #ErpApp