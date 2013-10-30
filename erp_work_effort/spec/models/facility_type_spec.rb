require 'spec_helper'

describe FacilityType do
  it "should create an instance of FacilityType" do
    ft = FacilityType.create
    ft.should be_instance_of(FacilityType)
  end
end
