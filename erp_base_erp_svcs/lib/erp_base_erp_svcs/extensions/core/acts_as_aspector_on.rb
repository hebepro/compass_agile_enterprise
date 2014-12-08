# gives the ability to execute code before and after instance method,
# the methods on which to attach code can be passed declaritive using
# this marco
# class Foo
#    acts_as_aspector_on :bar
#
#    def bar
#       puts "bar"    
#    end
#
#    
#    before :bar do |foo| #foo is the object invoking bar
#       puts "before bar" 
#    end
#                  
#     after :bar do |foo, result| # result is the return from foo.bar
#        puts "after bar"    
#     end            
# end

module ErpBaseErpSvcs
  module Extensions
    module Core
      module ActsAsAspectorOn
        
        def self.included(base)
          base.extend(ClassMethods)
        end

        module ClassMethods
          def acts_as_aspector_on(*meth_names)
            self.instance_eval do

              define_singleton_method :before do |method_name, &blk|
                if meth_names.include?(method_name)
                  m = instance_method(method_name)
                  define_method(method_name) do |*args, &block|
                    blk.call(self) unless blk.nil?
                    m.bind(self).call(*args, &block)
                  end
                end
              end

              
              define_singleton_method :after do |method_name, &blk|
                if meth_names.include?(method_name)
                  m = instance_method(method_name)
                  define_method(method_name) do |*args, &block|
                    result = m.bind(self).call(*args, &block)
                    blk.call(self, result) unless blk.nil?
                    result
                  end
                end
              end
              
             end # instance_eval

           
          end # acts_as_aspector
        end # ClassMethods        

     end # ActsAsAspector
    end # Core
  end # Extensions
end # ErpTechSvcs

Object.class_eval do
  include ErpBaseErpSvcs::Extensions::Core::ActsAsAspectorOn
end




