class AddTaskWorkEffortTypes
  
  def self.up
    WorkEffortType.create(description: 'Project', internal_identifier: 'project')
    WorkEffortType.create(description: 'Task', internal_identifier: 'task')
  end
  
  def self.down
    WorkEffortType.find_by_internal_identifier('project').destroy
    WorkEffortType.find_by_internal_identifier('Task').destroy
  end

end
