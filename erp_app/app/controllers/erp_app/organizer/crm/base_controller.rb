module ErpApp
  module Organizer
    module Crm
      class BaseController < ErpApp::Organizer::BaseController
        @@date_format = "%m/%d/%Y"
        @@datetime_format = "%m/%d/%Y %l:%M%P"

        def search_parties
          offset = params[:start] || 0
          limit = params[:limit] || 5
          query = params[:query] || nil
          role_type = params[:role_type]

          statement = Party.joins(:party_roles => :role_type).where('role_types.internal_identifier' => role_type)

          # Apply query if it exists
          statement = statement.where(Party.arel_table[:description].matches("%#{query}%")) if query

          # Get total count of records
          total = statement.count

          # Apply limit and offset
          parties = statement.limit(limit).offset(offset).all

          data = [].tap do |array|
            parties.each do |party|
              description_hash = {
                  :id => party.id,
                  :description => party.description,
                  :address_line1 => nil,
                  :address_line2 => nil,
                  :city => nil,
                  :state => nil,
                  :zip => nil
              }

              postal_address = party.find_contact_mechanism_with_purpose(PostalAddress, ContactPurpose.default)
              if postal_address
                description_hash[:address_line_1] = postal_address.address_line_1
                description_hash[:address_line_2] = postal_address.address_line_2
                description_hash[:city] = postal_address.city
                description_hash[:state] = postal_address.state
                description_hash[:zip] = postal_address.zip
              end

              array << description_hash
            end
          end

          render :json => {:success => true, :total => total, :parties => data}
        end

        def parties
          render :json => if request.put?
                            update_party
                          elsif request.post?
                            create_party
                          elsif request.get?
                            params[:party_id].blank? ? get_parties : get_party
                          elsif request.delete?
                            delete_party
                          end
        end

        def get_party_details
          @party = Party.find(params[:id]) rescue nil
        end

        def activate
          if @user = User.load_from_activation_token(params[:activation_token])
            @user.activate!
            success = true
            message = 'User was successfully activated.'
          else
            success = false
            message = "Invalid activation token."
          end

          render :json => {:success => success, :message => message} and return
        end

        private

        def get_party
          party = Party.find(params[:party_id])

          data = if party.business_party.class == Organization
                   party.business_party.to_hash(
                       :only => [:description, :tax_id_number]
                   )
                 else
                   party.business_party.to_hash(
                       :only => [:current_personal_title,
                                 :current_first_name,
                                 :current_middle_name,
                                 :current_last_name,
                                 :current_suffix,
                                 :current_nickname,
                                 :current_passport_number,
                                 :current_passport_expire_date,
                                 :birth_date,
                                 :gender,
                                 :total_years_work_experience,
                                 :marital_status,
                                 :social_security_number
                       ])
                 end

          data[:id] = party.id
          data[:model] = party.business_party.class.name
          data[:enterprise_identifier] = party.enterprise_identifier

          {:success => true, :data => data}
        end

        def get_parties
          offset = params[:start] || 0
          limit = params[:limit] || 25
          query_filter = params[:query_filter] || nil

          to_role = params[:to_role]
          from_roles = params[:from_roles].split(',')

          statement = Party.joins(:party_roles => :role_type).where('role_types.internal_identifier' => from_roles)

          unless to_role.blank?
            to_role_type = RoleType.iid(to_role)

            to_party_rln = current_user.party.from_relationships.where('to_role_type_id = ?', to_role_type).first

            statement = statement.joins("join party_relationships on party_relationships.party_id_from = parties_id")
            .where('party_relationships.party_id_to = ?', to_party_rln.party_id_to)
            .where('to_reln.role_type_id_to' => to_role_type)
          end

          # Apply query if it exists
          statement = statement.where(Party.arel_table[:description].matches("%#{query_filter}%")) if query_filter

          # Get total count of records
          total = statement.count

          # Apply limit and offset
          parties = statement.limit(limit).offset(offset).all

          {:success => true, :total => total, :parties => parties.collect { |item| item.to_hash(:only => [:id, :description, :created_at, :updated_at], :model => item.class.name) }}
        end

        def create_party
          result = {}

          ActiveRecord::Base.transaction do
            begin
              party_type = params[:business_party_type]

              # Get Party Roles
              to_role = params[:to_role]
              from_roles = params[:from_roles]

              klass = party_type.constantize

              # remove parameters not need for creation of object
              params.delete(:party_id)
              params.delete(:action)
              params.delete(:controller)
              params.delete(:business_party_type)
              params.delete(:authenticity_token)
              params.delete(:to_role)
              params.delete(:from_roles)

              if klass == Organization
                params.delete(:current_personal_title)
                params.delete(:current_first_name)
                params.delete(:current_middle_name)
                params.delete(:current_last_name)
                params.delete(:current_suffix)
                params.delete(:current_nickname)
                params.delete(:current_passport_number)
                params.delete(:current_passport_expire_date)
                params.delete(:birth_date)
                params.delete(:gender)
                params.delete(:total_years_work_experience)
                params.delete(:marital_status)
                params.delete(:social_security_number)
              else
                params.delete(:description)
                params.delete(:tax_id_number)
              end

              # clean up data
              params.each do |k, v|
                params[k] = params[k].strip
              end

              params[:birth_date] = Date.strptime(params[:birth_date], @@date_format) unless params[:birth_date].blank?
              params[:current_passport_expire_date] = Date.strptime(params[:current_passport_expire_date], @@date_format) unless params[:current_passport_expire_date].blank?

              business_party = klass.create(params)
              business_party.party.save

              # Apply from roles
              unless from_roles.blank?
                from_roles.split(',').each do |role_type_iid|
                  PartyRole.create(:party => business_party.party, :role_type => RoleType.iid(role_type_iid))
                end
              end

              # Apply to roles
              unless to_role.blank?
                to_party_rln = current_user.party.from_relationships.where('to_role_type_id = ?', RoleType.iid(to_role)).first
                if to_party_rln
                  business_party.create_relationship(to_party_rln.description, to_party_rln.to_party.id, to_party_rln.relationship_type)
                end
              end

              result = {:success => true, :message => "#{party_type} Added", :name => business_party.party.description}
            rescue Exception => ex
              Rails.logger.error ex.message
              Rails.logger.error ex.backtrace.join("\n")
              result = {:success => false, :message => "Error adding #{party_type}"}
            end
          end

          result
        end

        def update_party
          party_type = params[:business_party_type]
          klass = party_type.constantize

          party_id = params[:party_id]
          business_party_data = params

          # remove parameters not need for creation of object
          business_party_data.delete(:party_id)
          business_party_data.delete(:action)
          business_party_data.delete(:controller)
          business_party_data.delete(:business_party_type)
          business_party_data.delete(:authenticity_token)
          business_party_data.delete(:to_role)
          business_party_data.delete(:from_roles)

          if klass == Organization
            business_party_data.delete(:current_personal_title)
            business_party_data.delete(:current_first_name)
            business_party_data.delete(:current_middle_name)
            business_party_data.delete(:current_last_name)
            business_party_data.delete(:current_suffix)
            business_party_data.delete(:current_nickname)
            business_party_data.delete(:current_passport_number)
            business_party_data.delete(:current_passport_expire_date)
            business_party_data.delete(:birth_date)
            business_party_data.delete(:gender)
            business_party_data.delete(:total_years_work_experience)
            business_party_data.delete(:marital_status)
            business_party_data.delete(:social_security_number)
          else
            business_party_data.delete(:description)
            business_party_data.delete(:tax_id_number)
          end

          # clean up data
          business_party_data.each do |k, v|
            business_party_data[k] = business_party_data[k].strip
          end

          business_party_data[:birth_date] = Date.strptime(business_party_data[:birth_date], @@date_format) unless business_party_data[:birth_date].blank?
          business_party_data[:current_passport_expire_date] = Date.strptime(business_party_data[:current_passport_expire_date], @@date_format) unless business_party_data[:current_passport_expire_date].blank?

          party = Party.find(party_id)
          business_party = party.business_party

          business_party_data.each do |key, value|
            method = key + '='
            business_party.send method.to_sym, value
          end

          business_party.save

          {:success => true, :message => "#{party_type} updated"}
        end

        def delete_party
          Party.destroy(params[:party_id])

          {:success => true, :message => "Deleted"}
        end

      end #BaseController
    end #Crm
  end #Organizer
end #ErpApp
