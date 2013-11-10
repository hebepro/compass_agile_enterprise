class Notification < ActiveRecord::Base
  attr_protected :created_at, :updated_at

  NOTIFICATION_DYNAMIC_ATTRIBUTE_PREFIX = 'dyn_'

  has_dynamic_attributes :dynamic_attribute_prefix => NOTIFICATION_DYNAMIC_ATTRIBUTE_PREFIX, :destroy_dynamic_attribute_for_nil => false

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
    #
    # Dynamic attribute helper methods
    #

    def add_dyn_prefix(field)
      "#{NOTIFICATION_DYNAMIC_ATTRIBUTE_PREFIX}#{field}"
    end

    def remove_dyn_prefix(field)
      field.gsub(NOTIFICATION_DYNAMIC_ATTRIBUTE_PREFIX, '')
    end

    def create_notification_of_type(notification_type, dyn_attributes={}, created_by=nil)
      notification_type = notification_type.class == NotificationType ? notification_type : NotificationType.find_by_internal_identifier(notification_type)

      notification = self.new(
          created_by: created_by,
          notification_type: notification_type
      )

      dyn_attributes.each do |k,v|
        notification.set_dyn_attribute(k, v)
      end

      notification.save

      notification
    end

  end

  def get_dyn_attribute(field)
    self.send("#{Notification.add_dyn_prefix(field)}")
  end

  def set_dyn_attribute(field, value)
    self.send("#{Notification.add_dyn_prefix(field)}=", value)
  end

  def deliver_notification
    # template method
    # should be overridden in sub class
  end

end