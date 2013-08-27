require 'spec_helper'

describe Facility do
  it "should create an instance of Facility" do
    f = Facility.create
    f.should be_instance_of(Facility)
  end
end
