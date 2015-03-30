namespace :resume_parser do
  desc "Parse resume and populate model data.specify a file name as 'rake resume_parser:parse <file name>'"
  task :parse => :environment do
  	if (ARGV.size < 2)
  		puts 'Please specify a file name as "rake resume_parser:parse <file name>"'
  	else
  		file_name = ARGV.last
  		resume = Resume.new
  		puts "--------Parsing file #{file_name}--------"
  		resume.parse(file_name)
  		puts "--------#{file_name} parsed--------"
  		puts "--------Populating model data--------"
  		resume.populate_model_data
  		puts "--------Model data populated--------"
  		task file_name.to_sym do ; end
  	end
  end
end