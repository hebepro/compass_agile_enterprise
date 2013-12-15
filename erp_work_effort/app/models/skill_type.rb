class SkillType < ActiveRecord::Base
  attr_protected :created_at, :updated_at

  acts_as_nested_set
  include ErpTechSvcs::Utils::DefaultNestedSetMethods

  has_many  :party_skills
  has_many  :parties, :through => :party_skills

end
