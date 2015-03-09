class ChargeType < ActiveRecord::Base
  attr_protected :created_at, :updated_at

  has_many :charge_lines
end
