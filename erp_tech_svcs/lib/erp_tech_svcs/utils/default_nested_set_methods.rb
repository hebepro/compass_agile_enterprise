module ErpTechSvcs
  module Utils
    module DefaultNestedSetMethods
      def self.included(base)
        base.extend(ClassMethods)
      end

      def to_label
        description
      end

      def leaf
        children.size == 0
      end

      def to_json_with_leaf(options = {})
        self.to_json_without_leaf(options.merge(:methods => :leaf))
      end

      alias_method_chain :to_json, :leaf

      def to_tree_hash(options={})
        options = options.merge({
                                    :text => self.to_label,
                                    :leaf => self.leaf,
                                    :children => self.children.collect { |child| child.to_tree_hash(options) }
                                })

        self.to_hash(options)
      end

      module ClassMethods
        def find_roots
          where("parent_id = nil")
        end

        def find_children(parent_id = nil)
          parent_id.to_i == 0 ? self.roots : find(parent_id).children
        end

        # find_by_ancestor_iids
        # allows you to find a nested set element by the internal_identifiers in its ancestry
        # for example, to find a GlAccount whose internal_identifier is “site_4”, and whose parent’s internal_identifier is “nightly_room_charge”
        # and whose grandparent’s internal_identifier is “charge”, you would make this call:
        # gl_account = GlAccount.find_by_iids(['charge', 'nightly_room_charge', "site_4"])
        def find_by_ancestor_iids(iids)
          node = nil

          unless iids.is_a? Array
            iids.each do |iid|
              if (iid == iids.first)
                node = where("parent_id is null and internal_identifier = ?", iid).first
              else
                node = where("parent_id = ? and internal_identifier = ?", node.id, iid).first
              end
            end
          end

          node
        end

        # find existing role type or create it and return it.  Parent can be passed
        # which will scope this type by the parent
        def find_or_create(iid, description, parent=nil)
          # look for it
          record = if parent
                     parent.children.find_by_internal_identifier(iid)
                   else
                     find_by_internal_identifier(iid)
                   end

          unless record
            record = create(description: description, internal_identifier: iid)

            if parent
              record.move_to_child_of(parent)
            end
          end

          record
        end

      end

    end #DefaultNestedSetMethods
  end #Utils
end #ErpTechSvcs

