# create_table :applications do |t|
#   t.column :description, :string
#   t.column :icon, :string
#   t.column :internal_identifier, :string
#   t.column :type, :string
#   t.column :can_delete, :boolean, :default => true
#
#   t.timestamps
# end
#
# add_index :applications, :internal_identifier, :name => 'applications_internal_identifier_idx'

class Application < ActiveRecord::Base
  attr_protected :created_at, :updated_at

  has_user_preferences
  has_file_assets

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
      where('type = ?', 'DesktopApplication')
    end
  end

  def to_data_hash
    to_hash
  end

end
