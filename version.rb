module CompassAe
  module VERSION #:nodoc:
    MAJOR = 2
    MINOR = 1
    TINY  = 0

    STRING = [MAJOR, MINOR, TINY].compact.join('.')
  end

  def self.version
    CompassAe::VERSION::STRING
  end
end