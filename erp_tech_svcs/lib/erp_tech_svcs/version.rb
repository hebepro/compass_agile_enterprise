module ErpTechSvcs
  module VERSION #:nodoc:
    MAJOR = 4
    MINOR = 1
    TINY  = 2

    STRING = [MAJOR, MINOR, TINY].compact.join('.')
  end

  def self.version
    ErpTechSvcs::VERSION::STRING
  end
end
