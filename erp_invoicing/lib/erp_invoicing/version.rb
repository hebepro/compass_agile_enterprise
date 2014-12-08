module ErpInvoicing
  module VERSION #:nodoc:
    MAJOR = 4
    MINOR = 0
    TINY  = 1

    STRING = [MAJOR, MINOR, TINY].compact.join('.')
  end

  def self.version
    ErpInvoicing::VERSION::STRING
  end
end
