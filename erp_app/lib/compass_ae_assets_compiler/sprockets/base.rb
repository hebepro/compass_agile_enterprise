module CompassAeAssetsCompiler
  module Sprockets
    class Base
      attr_reader :env
      
      def initialize(options={})
        @env = ::Sprockets::Environment.new(Rails.root)
        @env.js_compressor  = ::Sprockets::LazyCompressor.new { Uglifier.new(:mangle => false) } if !options[:uglify].nil? and options[:uglify] == true
      end
      
    end
  end
end
