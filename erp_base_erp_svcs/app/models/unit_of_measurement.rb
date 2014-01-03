class UnitOfMeasurement < ActiveRecord::Base

  has_one  :carrier_unit_of_measurement

  attr_accessible :description

  def to_data_hash

    {
        :id => self.id,
        :description => self.description
    }

  end

end