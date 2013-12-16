class AddTaskWorkEffortTypes
  
  def self.up
    WorkEffortType.create(description: 'Ticket', internal_identifier: 'ticket')
  end
  
  def self.down
    WorkEffortType.find_by_internal_identifier('ticket').destroy
  end

end
