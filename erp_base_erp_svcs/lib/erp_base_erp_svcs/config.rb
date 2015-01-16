module ErpBaseErpSvcs
  module Config
    class << self
      attr_accessor :compass_ae_engines, :encryption_key

      def init!
        @defaults = {
          :@compass_ae_engines => [],
          :@encryption_key => '314465fe-9c2b-11e4-89d3-123b93f75cba'
        }
      end

      def reset!
        @defaults.each do |k,v|
          instance_variable_set(k,v)
        end
      end

      def configure(&blk)
        @configure_blk = blk
      end

      def configure!
        @configure_blk.call(self) if @configure_blk
      end
    end
    init!
    reset!
  end
end
