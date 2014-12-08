module ErpDevSvcs
  module VERSION #:nodoc:
    MAJOR = 4
    MINOR = 0
    TINY  = 0

    STRING = [MAJOR, MINOR, TINY].compact.join('.')
  end

  def self.version
    ErpDevSvcs::VERSION::STRING
  end
end
