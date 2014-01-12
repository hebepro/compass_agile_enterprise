class AddTaskDependency
  
  def self.up
    WorkEffortAssociationType.create(description: 'Dependent Task', internal_identifier: 'dependency')
  end
  
  def self.down
    WorkEffortAssociationType.where('internal_identifier = ?', 'dependency').first.destroy
  end

end
