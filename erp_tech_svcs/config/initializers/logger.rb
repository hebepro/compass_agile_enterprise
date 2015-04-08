Logger::SimpleFormatter.class_eval do
  def call(severity, time, progname, msg)
    # generate the info part of the line
    lead_string = "[#{time.strftime('%Y-%m-%d %H:%M:%S.%L')}] [" + sprintf("%-5s","#{severity}") + "]"
    lead_string = lead_string + " [#{progname}]" unless progname.nil? or progname.empty?

    # figure out how far it needs to be indented
    # add +1 because we manually insert a space when outputting the message
    indent = "".rjust(lead_string.length+1)

    # use the logger default method to prepare the message for output
    msg = msg2str(msg)

    # indent all subsequent lines to help with readability
    msg.gsub!( /([\r\n]+)/, "\\1#{indent}") if msg.respond_to? :gsub

    "#{lead_string} #{msg}\n"
  end
end