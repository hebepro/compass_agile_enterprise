class WebsiteInquiry < ActiveRecord::Base
  attr_protected :created_at, :updated_at

  belongs_to :website
  belongs_to :created_by, :class_name => 'User', :foreign_key => 'created_by_id'

  validates :first_name, presence: true
  validates :last_name, presence: true
  validates :message, presence: true
  validates :email, presence: true, format: {with: /\A([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})\z/i, on: :create}

end
