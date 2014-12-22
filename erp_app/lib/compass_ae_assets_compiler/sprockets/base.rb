module CompassAeAssetsCompiler
  module Sprockets
    class Base
      attr_reader :env
      
      def initialize(options={})
        @env = ::Sprockets::Environment.new(Rails.root)
        if options[:uglify] == true
          @env.js_compressor  = ::Sprockets::LazyCompressor.new { Uglifier.new(:mangle => false) }
          @env.css_compressor  = ::Sass::Rails::CssCompressor.new
        end
        register_custom_directive('application/javascript')
        register_custom_directive('text/css')
      end

      
      def register_custom_directive(mime_type, compass_ae_directive_klass = ::CompassAeDirectiveProcessor)
        env.unregister_processor(mime_type, ::Sprockets::DirectiveProcessor)
        env.register_processor(mime_type, compass_ae_directive_klass)
      end


      def compile
        raise 'to be overriden'
      end

      
    end
  end
end

