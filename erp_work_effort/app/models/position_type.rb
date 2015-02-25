class PositionType < ActiveRecord::Base

  attr_protected :created_at, :updated_at
  attr_accessible :description

end
