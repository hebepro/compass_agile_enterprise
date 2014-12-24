require 'action_view'

module ErpApp
  module ApplicationResourceLoader
    class BaseLoader
      
      protected
      
      def sort_files(files)
        files.collect do |file|
          value = file.split('.')[1]
          (value != 'js' ? {:file => file, :value => value.to_i} : {:file => file, :value => ErpApp::Config.max_js_loader_order_index})
        end.sort_by{|item| [item[:value]]}.collect{|item| item[:file]}
      end
      
    end#BaseLoader
  end#ApplicationResourceLoader
end#ErpApp
