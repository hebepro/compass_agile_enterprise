class Position < ActiveRecord::Base

  belongs_to :party
  belongs_to :position_type

end
