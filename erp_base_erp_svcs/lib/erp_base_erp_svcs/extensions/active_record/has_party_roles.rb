module ErpBaseErpSvcs
  module Extensions
    module ActiveRecord
      module HasPartyRoles
        def self.included(base)
          base.extend(ClassMethods)
        end

        module ClassMethods
          def has_party_roles
            extend HasPartyRoles::SingletonMethods
            include HasPartyRoles::InstanceMethods

            has_many :entity_party_roles, :as => :entity_record
          end
        end

        module SingletonMethods
          def with_party_role_types(role_types)
            joins(:entity_party_roles)
                .where("entity_party_roles.role_type_id in (#{role_types.collect(&:id).join(',')})")
          end

          def with_party_role(party, role_type)
            joins(:entity_party_roles).where('entity_party_roles.role_type_id = ?', role_type.id)
                .where('entity_party_roles.party_id = ?', party.id)
          end
        end

        module InstanceMethods
          def add_party_with_role(party, role_type)
            EntityPartyRole.create(party: party,
                                   role_type: role_type,
                                   entity_record: self)
          end
        end

      end # HasPartyRoles
    end # ActiveRecord
  end # Extensions
end # ErpBaseErpSvcs
