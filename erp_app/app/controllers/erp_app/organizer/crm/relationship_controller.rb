module ErpApp
  module Organizer
    module Crm
      class RelationshipController < ErpApp::Organizer::BaseController

        def index

          render :inline => if request.get?
                              get_party_relationships
                            end

        end

        def to_party_relationship_types
          party = Party.find(params[:party_id])

          relationship_types = party.to_relationships.collect(&:relationship_type)
        end

        def get_party_relationship
          party = Party.find(params[:party_id])
          relationships = party.find_relationships_by_type(params[:relationship_type])

          total_count = relationships.length

          {:totalCount => total_count,
           :data => relationships.collect do |relation|
             related_party = relation.to_party
             {
                 :party_id => related_party.id,
                 :party_desc => related_party.description,
                 :relationship => relation.description,
                 :created_at => relation.created_at,
                 :updated_at => relation.updated_at,
                 :from_date => relation.from_date,
                 :thru_date => relation.thru_date,
                 :role_type => relation.to_role
             }
           end
          }.to_json
        end

      end #RelationshipController
    end #Crm
  end #Organizer
end #ErpApp

