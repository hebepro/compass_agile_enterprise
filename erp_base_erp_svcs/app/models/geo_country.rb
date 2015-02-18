class GeoCountry < ActiveRecord::Base
  attr_accessible :name, :created_at, :external_id, :iso_code_2, :iso_code_3, :id, :display
  
  has_many :postal_addresses
  has_many :geo_zones

  validates :name, :presence => {:message => 'Name cannot be blank'}
  validates :iso_code_2, :presence => {:message => 'ISO code 2 cannot be blank'}
  validates :iso_code_3, :presence => {:message => 'ISO code 3 cannot be blank'}

  class << self

    def countries_with_us_first
      countries = where('iso_code_2 <> ? and display = ?', 'US', true)
      countries.unshift(where('iso_code_2 = ?', 'US').first)

      countries
    end

  end

end