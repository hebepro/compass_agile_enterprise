namespace :resume_parser do
  desc "Parses resume file.Specify a file name as 'rake resume_parser:parse <file name>'"
  task :parse => :environment do
  	if (ARGV.size < 2)
  		puts 'Please specify a file name as "rake resume_parser:parse <file name>"'
  	else
  		file_name = ARGV.last
  		resume = Resume.new

  		puts "--------Parsing file #{file_name}--------"

      if resume.parse(file_name)
        puts "--------file #{file_name} parsed--------"
      end
      task file_name.to_sym do ; end
  	end
  end
end