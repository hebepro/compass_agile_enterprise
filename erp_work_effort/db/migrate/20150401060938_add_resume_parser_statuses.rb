class AddResumeParserStatuses < ActiveRecord::Migration
  def self.up
    resume_parser = TrackedStatusType.create(description: 'Resume Parser', internal_identifier: 'resume_parser')

    ['Pending', 'Complete', 'Error'].each do |status|
      _status = TrackedStatusType.create(description: status, internal_identifier: status.underscore)
      _status.move_to_child_of(resume_parser)
    end
  end

  def self.down
    TrackedStatusType.iid('resume_parser').destroy
  end
end
