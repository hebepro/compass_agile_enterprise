class TrackedStatusType < ActiveRecord::Base
  attr_accessible :description, :internal_identifier

  acts_as_nested_set
  include ErpTechSvcs::Utils::DefaultNestedSetMethods

  has_many :status_applications

  def self.iid(internal_identifier)
    where('internal_identifier = ?', internal_identifier).first
  end

end