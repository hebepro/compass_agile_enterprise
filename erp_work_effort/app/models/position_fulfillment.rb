class PositionFulfillment < ActiveRecord::Base

  belongs_to :held_by_party, class_name: "Party"
  belongs_to :position

end
