require 'spec_helper'

describe SkillType do
  it "should create an instance of SkillType" do
    st = SkillType.create
    st.should be_instance_of(SkillType)
  end
end
