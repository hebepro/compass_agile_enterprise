namespace :theme do
	desc 'Parse Themes Authored by third parties'
	task :parse => :environment do
		path = File.join(Rails.root.to_s , "themes")
		if Dir.exist?(path)
			Dir.chdir(path)
			theme_files = Dir['*.zip'] # gets all zip files
			if theme_files.empty?
				puts "No zipped themes files were found"
			else
				extract_files(theme_files) # extracts (unzips) the zip files
				extracted_themes_path = File.join(Rails.root.to_s , "themes", "extracted_themes")
				Dir.chdir(extracted_themes_path)
				Dir.glob("*") do |extracted_theme|
					parse_extracted_themes(extracted_theme) # parses the theme file
					puts "Theme #{extracted_theme} processed"
				end
			end
		else
			puts "Directory 'themes' could not be found"
		end
	end
end

def parse_extracted_themes(extracted_theme)
	destination_theme_path = File.join(Rails.root.to_s, "themes", "extracted_themes", extracted_theme)
	source_template_path = File.join(Rails.root.to_s, 'tmp', 'templates')
	destination_template_path = File.join(destination_theme_path, 'templates')
	Dir.mkdir(destination_template_path)
	FileUtils.copy_entry source_template_path, destination_template_path
	Dir.chdir(destination_theme_path)
	Dir.glob("*") do |entry|
		if File.directory?(entry)
			case entry
			when 'js', 'Js', 'JS'
				FileUtils.mv entry,"javascripts"
			when 'css', 'Css', 'CSS'
				FileUtils.mv entry,"stylesheets"
			when 'img', 'Img', 'IMG'
				FileUtils.mv entry,"images"
			end
		else
			parse_index_file(entry,extracted_theme) if entry.starts_with?('index')
		end
	end
end

def extract_files(theme_files)
	destination_path = File.join(Rails.root.to_s , "themes", "extracted_themes")
	Dir.mkdir(destination_path) unless File.exists?(destination_path)
	theme_files.each do |theme_file|
		Zip::ZipFile.open(theme_file) do |zip_file|
	   zip_file.each do |f|
	     f_path=File.join(destination_path, f.name)
	     FileUtils.mkdir_p(File.dirname(f_path))
	     zip_file.extract(f, f_path) unless File.exist?(f_path)
	   end
	 end
	 puts "Theme #{theme_file} extracted"
	end
end

def parse_index_file(index_file,extracted_theme)
	file = replace = File.read(index_file)
	file.each_line do |line|
		if link_tag = (line.match(/<link href=(.*)rel="stylesheet"/m) or line.match(/<link href=(.*)rel='stylesheet'/m))
			if link_tag[1].strip.starts_with?('"css')
				css_file_name = link_tag[1].strip.gsub('css/','')
				new_css_tag = "  <%= theme_stylesheet_link_tag '#{extracted_theme}', #{css_file_name} %>\n"
				replace = replace.gsub(line, new_css_tag)
				File.open(index_file, "w") {|file| file.write replace}
			end
		elsif script_tag = (line.match(/<script src=(.*)<\/script>/m))
			if script_tag[1].strip.starts_with?('"js')
				js_file_name = script_tag[1].strip.gsub('js/','').gsub('>','')
				new_js_tag = "  <%= theme_javascript_include_tag '#{extracted_theme}', #{js_file_name} %>\n"
				replace = replace.gsub(line, new_js_tag)
				File.open(index_file, "w") {|file| file.write replace}
			end
		end
	end
	base_layout_path = File.join(Rails.root.to_s,"themes","extracted_themes",extracted_theme,"templates","layouts","knitkit","base.html.erb")
	File.delete(base_layout_path)
	FileUtils.mv index_file, base_layout_path
end
