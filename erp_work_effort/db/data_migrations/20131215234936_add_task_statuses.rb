class AddTaskStatuses
  
  def self.up
    if TrackedStatusType.find_by_internal_identifier('pending').nil?
      TrackedStatusType.create(description: 'Pending', internal_identifier: 'pending')
    end

    if TrackedStatusType.find_by_internal_identifier('in_progress').nil?
      TrackedStatusType.create(description: 'In Progress', internal_identifier: 'in_progress')
    end

    if TrackedStatusType.find_by_internal_identifier('complete').nil?
      TrackedStatusType.create(description: 'Complete', internal_identifier: 'complete')
    end
  end
  
  def self.down
    #remove data here
  end

end
