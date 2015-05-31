module ErpCommunicationEvents
  module VERSION #:nodoc:
    MAJOR = 4
    MINOR = 1
    TINY  = 0

    STRING = [MAJOR, MINOR, TINY].compact.join('.')
  end

  def self.version
    ErpCommunicationEvents::VERSION::STRING
  end
end
