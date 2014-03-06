module CompassAeConsole
  module ErpApp
    module Desktop
      class BaseController < ::ErpApp::Desktop::BaseController
        def command
          begin
            result = ""

            # NOTE- the console uses a shared binding. this is due to the fact
            # that binding instances are not serializable and cant be stored
            # in a user session. Until this is resolved we use a global var.
            # this should not pose a problem as the console should only be used
            # in development or by a sysadmin. 

            # the shared binding is needed to allow for variable scope visibility
            # across multiple requests 
            if ($session_binding==nil)
              $session_binding=binding
            end

            command_message=params[:command_message]

            # here we handle any desktop console-specific command
            # these can include non-eval related funtions
            # or provide shortcuts to common eval expressions
            result = case command_message
                       when /^-help/
                         help_message
                       when /^-clear/
                         #this is handled in the console desktop application
                       when /^-time/
                         evaluate_command("Time.now")
                       when /^-whoami/
                         evaluate_command("current_user.username")
                       else
                         evaluate_command(command_message)
                     end

            result_message = result.to_s.gsub("\n", "<br />\n")
            render :json => {:success => "#{result_message}<hr><br>"}
          end
        end

        private

        #****************************************************************************
        def help_message()
          message = "<span color='lightgray'><b>Compass Desktop Console Help<b><hr>"
          message<< "<ul>"
          message<< "<li>-clear : Clear screen contents.</li>"
          message<< "<li>-help : This help list.</li>"
          message<< "<li>-time : Current time.</li>"
          message<< "<li>-whoami : Logged in as.</li>"
          message<< "</ul> </span>"
        end

        #****************************************************************************
        def highlight_class(klass)
          "".tap do |buffer|
            klass.columns.each do |column|
              buffer << "<div>#{column.name}<span style='color:gray'>:</span><span style='color:gold'>#{column.type}</span></div>"
            end
          end
        end

        def hightlight_instance(instance)
          "".tap do |buffer|
            instance.attributes.keys.sort.each do |model_attribute_key|
              buffer << "<div>#{model_attribute_key} <span style='color:lightgray'>=</span><span style='color:gold'>#{instance.attributes[model_attribute_key]}</span></div>"
            end
          end
        end

        #****************************************************************************

        def evaluate_command(command_message)
          begin
            result_eval = $session_binding.eval(command_message)

            result = if result_eval.respond_to?("columns") # If it responds to columns, this is an ActiveRecord model

                       render_active_record_model(result_eval)
                     elsif result_eval.respond_to?("class") && result_eval.class.ancestors.include?(ActiveRecord::Base)

                       render_model(result_eval)
                     elsif result_eval.is_a? Array

                       render_array(result_eval)
                     elsif result_eval.is_a? Hash

                       render_hash(result_eval)
                     else

                       "#{result_eval.inspect}"
                     end
          rescue Exception => e
            result = "<span style='color:red'>#{e.to_s}</span>"
          end

          result
        end

        #****************************************************************************
        def render_active_record_model(result_eval)
          "<div>#{highlight_class(result_eval)}<div>"
        end

        #****************************************************************************
        def render_model(result_eval)
          "<div style='color:YellowGreen'>#{result_eval.class}</div><div>#{hightlight_instance(result_eval)}<div>"
        end

        #****************************************************************************
        def render_array(result_eval)
          result = "#{result_eval.class.to_s}"
          count = 0

          result_eval.each do |array_element|
            if array_element.is_a? ActiveRecord::Base
              result << "<span style='color:YellowGreen'>#{array_element.class}[<span color='white'>#{count}</span>] </span>#{hightlight_instance(array_element)} <br>"
            else
              result << "<span style='color:YellowGreen'>#{array_element.class}[<span color='white'>#{count}</span>] </span>#{array_element} <br>"
            end
            count=count+1
          end
          result
        end

        #****************************************************************************
        def render_hash(result_eval)
          result = "#{result_eval.class.to_s}<br>"
          count = 0

          result_eval.keys.each do |hash_key|
            symbol_modifier=''
            if hash_key.is_a? Symbol
              symbol_modifier=':'
            end
            if hash_key.is_a? ActiveRecord::Base
              result<< "<span style='color:YellowGreen'>#{result_eval.class}[<span style='color:white'>#{symbol_modifier}#{hash_key}</span>] => </span>#{highlight(result_eval[hash_key])} <br>"
            else
              result<<"<span style='color:YellowGreen'>#{result_eval.class}</span>[<span style='color:white'>#{symbol_modifier}#{hash_key}</span>] => #{result_eval[hash_key]} <br>"
            end
            count=count+1
          end
          result
        end
      end
    end #end BaseController
  end #end ErpApp
end #end Console