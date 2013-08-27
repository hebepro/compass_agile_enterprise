class WorkEffort < ActiveRecord::Base
  attr_protected :created_at, :updated_at

  acts_as_nested_set
  include ErpTechSvcs::Utils::DefaultNestedSetMethods
  has_tracked_status

  belongs_to  :work_effort_type
  belongs_to  :work_effort_purpose_type

  ## How is this Work Effort related to Work Order Items (order_line_items)
  has_many    :work_order_item_fulfillments, :dependent => :destroy
  has_many    :order_line_items, :through => :work_order_item_fulfillments

  ## How is this Work Effort related to business parties, requestors, workers, approvers
  has_many    :work_effort_party_assignments, :dependent => :destroy
  has_many    :parties, :through => :work_effort_party_assignments

  ## What Inventory Items are used in the execution of this Work Effort
  has_many    :work_effort_inventory_assignments, :dependent => :destroy
  has_many    :inventory_entries, :through => :work_effort_inventory_assignments

  ## What Fixed Assets (tools, equipment) are used in the execution of this Work Effort
  has_many    :work_effort_fixed_asset_assignments, :dependent => :destroy
  has_many    :fixed_assets, :through => :work_effort_fixed_asset_assignments

  ## Allow for polymorphic subtypes of this class
  belongs_to :work_effort_record, :polymorphic => true

  belongs_to :projected_cost, :class_name => 'Money', :foreign_key => 'projected_cost_money_id'
  belongs_to :actual_cost, :class_name => 'Money', :foreign_key => 'actual_cost_money_id'
  belongs_to :facility

  def status
    # get status via has_tracked_status
    current_status
  end

  # return true if this effort has been started, false otherwise
  def started?
    current_status.nil? ? false : true
  end
  
  # return true if this effort has been completed, false otherwise
  def completed?
    finished_at.nil? ? false : true
  end
  
  def finished?
    completed?
  end

  #start initial work_status
  def start(status_type)
    effort = self
    unless self.descendants.flatten!.nil?
      children = self.descendants.flatten
      effort = children.last
    end

    if current_status.nil?
      effort.current_status = status_type
      effort.started_at = DateTime.now
      effort.save
    else
      raise 'Effort Already Started'
    end
  end

  def finish
    complete
  end

  def complete
    self.finished_at = Time.now
    self.actual_completion_time = time_diff_in_minutes(self.finished_at.to_time, self.started_at.to_time)
    self.save
    self.parent.start_effort unless self.parent.nil?
  end

  protected
  def time_diff_in_minutes (time_one, time_two)
    (((time_one - time_two).round) / 60)
  end
end
