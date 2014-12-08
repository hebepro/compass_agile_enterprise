class Notification < ActiveRecord::Base
  attr_protected :created_at, :updated_at
  
  # serialize custom attributes
  is_json :custom_fields

  belongs_to :notification_type
  belongs_to :created_by, :foreign_key => 'created_by_id', :class_name => 'Party'
  
  include AASM

  aasm_column :current_state

  aasm_initial_state :pending

  aasm_state :pending
  aasm_state :notification_delivered

  aasm_event :delivered_notification do
    transitions :to => :notification_delivered, :from => [:pending]
  end

  class << self

    def create_notification_of_type(notification_type, dyn_attributes={}, created_by=nil)
      notification_type = notification_type.class == NotificationType ? notification_type : NotificationType.find_by_internal_identifier(notification_type)

      notification = self.new(
          created_by: created_by,
          notification_type: notification_type
      )

      dyn_attributes.each do |k,v|
        notification.custom_fields[k] = v
      end

      notification.save

      notification
    end

  end

  def deliver_notification
    # template method
    # should be overridden in sub class
  end

end
