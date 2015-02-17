class Application < ActiveRecord::Base
  attr_protected :created_at, :updated_at

  has_user_preferences

  has_and_belongs_to_many :users

  validates_uniqueness_of :internal_identifier, :scope => :type, :case_sensitive => false

  class << self
    def iid(internal_identifier)
      find_by_internal_identifier(internal_identifier)
    end

    def apps
      where('type is null')
    end

    def allows_business_modules
      where('allow_business_modules = ?', true)
    end

    def desktop_applications
      where('type == ?', 'DesktopApplication')
    end
  end

end
