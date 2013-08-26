class WorkEffort < ActiveRecord::Base
  attr_protected :created_at, :updated_at

  acts_as_nested_set
  include ErpTechSvcs::Utils::DefaultNestedSetMethods
  has_tracked_status

  belongs_to  :work_effort_type
  belongs_to  :work_effort_purpose_type

  ## How is this Work Effort related to Work Order Items (order_line_items)
  has_many    :work_effort_item_fulfillments, :dependent => :destroy
  has_many    :order_line_items, :through => :work_effort_item_fulfillments

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

  belongs_to :projected_cost, :class_name => 'Cost', :foreign_key => 'projected_cost_id'
  belongs_to :actual_cost, :class_name => 'Cost', :foreign_key => 'actual_cost_id'
  belongs_to :facility

  def status
    work_effort_status = self.descendants.flatten!.nil? ? self.get_current_status : self.descendants.flatten!.last.get_current_status
    work_effort_status.work_effort_status_type.description
  end

  # return true if this effort has been started, false otherwise
  def started?
    get_current_status.nil? ? false : true
  end
  
  # return true if this effort has been completed, false otherwise
  def completed?
    finished_at.nil? ? false : true
  end
  
  #start initial work_status
  def start(status_type)
    effort = self
    unless self.descendants.flatten!.nil?
      children = self.descendants.flatten
      effort = children.last
    end

    current_status = effort.get_current_status

    if current_status.nil?
      work_effort_status = WorkEffortStatus.create(:started_at => DateTime.now, :work_effort_status_type => status_type)
      effort.work_effort_statuses << work_effort_status
      effort.started_at = DateTime.now
      effort.save
    else
      raise 'Effort Already Started'
    end
  end

  # completes current status if current status is in progress
  # start status passed in
  # if status passed in is last status, starts parent status if status exists
  def send_to_status(status_type, complete_effort=false, complete_status=false)
    current_status = get_current_status
    
    unless current_status.nil?
      new_work_effort_status = WorkEffortStatus.new
      new_work_effort_status.started_at = DateTime.now
      new_work_effort_status.finished_at = new_work_effort_status.started_at if complete_status
      new_work_effort_status.work_effort_status_type = status_type
      new_work_effort_status.work_effort = self
      new_work_effort_status.save
      current_status.finished_at = DateTime.now
      current_status.save
      complete_work_effort if complete_effort
    else
      raise 'Effort Has Not Started'
    end
  end
  
  #completes current status
  #start next status if not last status
  #starts parent status if parent exists
  def send_to_next_status
    current_status = get_current_status

    unless current_status.nil?
      next_status_type = current_status.work_effort_status_type.next_status_type

      if next_status_type.nil?
        complete_work_effort
      else
        new_work_effort_status = WorkEffortStatus.new
        new_work_effort_status.started_at = DateTime.now
        new_work_effort_status.work_effort_status_type = next_status_type
        new_work_effort_status.work_effort = self
        new_work_effort_status.save
      end

      current_status.finished_at = DateTime.now
      current_status.save
    else
      raise 'Effort Has Not Started' if current_status.nil?
    end
  end

  def send_to_previous_status
    current_status = get_current_status

    unless current_status.nil?
      previous_status_type = current_status.work_effort_status_type.previous_status_type

      if previous_status_type.nil?
        raise 'Current status is initial status' if current_status.nil?
      else
        new_work_effort_status = WorkEffortStatus.new
        new_work_effort_status.started_at = DateTime.now
        new_work_effort_status.work_effort_status_type = previous_status_type
        new_work_effort_status.work_effort = self
        new_work_effort_status.save
      end

      current_status.finished_at = DateTime.now
      current_status.save
    else
      raise 'Effort Has Not Started' if current_status.nil?
    end
  end

  def complete_work_effort
    self.finished_at = Time.now
    self.actual_completion_time = time_diff_in_minutes(self.finished_at.to_time, self.started_at.to_time)
    self.save
    self.parent.start_effort unless self.parent.nil?
  end

  protected
  def get_current_status
    self.work_effort_statuses.find_by_finished_at(nil)
  end

  def time_diff_in_minutes (time_one, time_two)
    (((time_one - time_two).round) / 60)
  end
end
