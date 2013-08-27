require 'spec_helper'

describe WorkEffort do
  it "can be instantiated" do
    WorkEffort.new.should be_an_instance_of(WorkEffort)
  end

  it "can be saved successfully" do
    WorkEffort.create().should be_persisted
  end

  it "a model can acts_as_work_effort" do
    AuditLog.class_eval do 
      acts_as_work_effort
    end

    al = AuditLog.new
    al.description = 'test audit log'
    al.party_id = 1
    al.audit_log_type_id = 1
    al.save

    al.should be_an_instance_of(AuditLog)
    al.should be_persisted

    al.work_effort.should be_an_instance_of(WorkEffort)
    al.work_effort.should be_persisted
  end
end