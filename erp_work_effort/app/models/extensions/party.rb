Party.class_eval do
  has_many :resource_availabilities, :class_name => 'PartyResourceAvailability', :dependent => :destroy
  has_many :assigned_to_work_efforts, :class_name => 'WorkEffortPartyAssignment', :dependent => :destroy
end
