require 'fileutils'

namespace :knitkit do
  namespace :website do

    task :import, [:website_iid, :username, :export_path] => :environment do |t, args|
      website = Website.find_by_internal_identifier(args[:website_iid])
      user = User.find_by_username(args[:username])

      if !website and user

        puts 'Starting Import...'
        Website.import(File.open(args[:export_path]), user)
        puts 'Import Complete'

      else
        puts "Website already exists, please delete first" if website
        puts "Could not find user" unless user
      end
    end

    task :export, [:website_iid, :export_path] => :environment do |t, args|
      website = Website.find_by_internal_identifier(args[:website_iid])

      if website

        puts 'Starting Export...'

        path = website.export
        FileUtils.mv(path, args[:export_path])

        puts 'Export Complete'

      else
        puts "Could not find website"
      end
    end

  end
end
