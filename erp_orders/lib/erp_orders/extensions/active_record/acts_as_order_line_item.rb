module ErpOrders
  module Extensions
    module ActiveRecord
      module ActsAsOrderLineItem

        def self.included(base)
          base.extend(ClassMethods)
        end

        module ClassMethods
          def acts_as_order_line_item
            extend ActsAsOrderLineItem::SingletonMethods
            include ActsAsOrderLineItem::InstanceMethods
        
            after_initialize :new_order_line_item
            after_update     :save_order_line_item
            after_save       :save_order_line_item
            after_destroy    :destroy_order_line_item
        
            has_one :order_line_item, :as => :order_line_record
        
            [ :product_description,
              :product_description=,
              :product_instance,
              :product_instance=,
              :product_instance_description,
              :product_instance_description=,
              :product_type,
              :product_type=,
              :product_type_description,
              :product_type_description=,
              :sold_price,
              :sold_price=,
              :sold_amount,
              :sold_amount=,
              :product_offer,
              :product_offer=,
              :quantity, 
              :quantity=,
              :unit_of_measurement,
              :unit_of_measurement=,
              :dba_organization
            ].each do |m| 
              delegate m, :to => :order_line_item 
            end        
          end
        end

        module SingletonMethods
        end

        module InstanceMethods
          def save_order_line_item
            self.order_line_item.save
          end

          def destroy_order_line_item
            self.order_line_item.destroy
          end

          def new_order_line_item
            if self.new_record? and self.order_line_item.nil?
              order_line_item = OrderLineItem.new
              self.order_line_item = order_line_item
              order_line_item.order_line_record = self
            end
          end
        end
      end
    end
  end
end
