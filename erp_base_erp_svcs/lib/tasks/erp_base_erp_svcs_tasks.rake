require 'fileutils'
require 'yaml'

#redefine copy engine migrations rake task
Rake::Task["railties:install:migrations"].clear

namespace :railties do
  namespace :install do
    # desc "Copies missing migrations from Railties (e.g. plugins, engines). You can specify Railties to use with FROM=railtie1,railtie2"
    task :migrations => :'db:load_config' do
      to_load = ENV['FROM'].blank? ? :all : ENV['FROM'].split(",").map { |n| n.strip }
      #added to allow developer to perserve timestamps
      preserve_timestamp = ENV['PRESERVE_TIMESTAMPS'].blank? ? false : (ENV['PRESERVE_TIMESTAMPS'].to_s.downcase == "true")
      #refresh will replace migrations from engines
      refresh = ENV['REFRESH'].blank? ? false : (ENV['REFRESH'].to_s.downcase == "true")
      railties = ActiveSupport::OrderedHash.new
      Rails.application.railties.all do |railtie|
        next unless to_load == :all || to_load.include?(railtie.railtie_name)

        if railtie.respond_to?(:paths) && (path = railtie.paths['db/migrate'].first)
          railties[railtie.railtie_name] = path
        end
      end

      on_skip = Proc.new do |name, migration|
        puts "NOTE: Migration #{migration.basename} from #{name} has been skipped. Migration with the same name already exists."
      end

      on_copy = Proc.new do |name, migration, old_path|
        puts "Copied migration #{migration.basename} from #{name}"
      end

      ActiveRecord::Migration.copy(ActiveRecord::Migrator.migrations_paths.first, railties,
                                   :on_skip => on_skip, :on_copy => on_copy, :preserve_timestamp => preserve_timestamp, :refresh => refresh)
    end
  end
end

namespace :db do
  namespace :migrate do

    desc "list pending migrations"
    task :list_pending => :environment do
      pending_migrations = ActiveRecord::Migrator.new('up', 'db/migrate/').pending_migrations.collect { |item| File.basename(item.filename) }
      puts "================Pending Migrations=========="
      puts pending_migrations
      puts "============================================"
    end

  end #migrate
end #db

namespace :compass_ae do
  namespace :ec2 do

    desc "Create EC2 instance"
    task :create_instance => :environment do

      account = YAML::load(File.open(File.join(Rails.root, 'config', 'aws_ec2.yaml')))

      AWS.config(:access_key_id => account['access_key_id'],
                 :secret_access_key => account['secret_access_key'])

      ec2 = AWS::EC2.new.regions['us-west-2'] # choose region here
      ami_name = 'compassae_base' # which AMI to search for and use
      key_pair_name = 'compassae_win' # key pair name
      security_group_name = 'root' # security group name
      instance_type = 't1.micro' # machine instance type (must be approriate for chosen AMI)

      # find the AMI based on name (memoize so only 1 api call made for image)
      image = AWS.memoize do
        ec2.images.filter("root-device-type", "ebs").filter('name', ami_name).first
      end

      if image
        puts "Using AMI: #{image.id}"
      else
        raise "No image found matching #{ami_name}"
      end

      # find or create a key pair
      key_pair = ec2.key_pairs[key_pair_name]
      puts "Using keypair #{key_pair.name}, fingerprint: #{key_pair.fingerprint}"

      # find security group
      security_group = ec2.security_groups.find { |sg| sg.name == security_group_name }
      puts "Using security group: #{security_group.name}"

      # create the instance (and launch it)
      instance = ec2.instances.create(:image_id => image.id,
                                      :instance_type => instance_type,
                                      :count => 1,
                                      :security_groups => security_group,
                                      :key_pair => key_pair)
      puts "Launching machine ..."

      # wait until battle station is fully operational
      sleep 1 until instance.status != :pending
      puts "Launched instance #{instance.id}, status: #{instance.status}, public dns: #{instance.dns_name}, public ip: #{instance.ip_address}"
      exit 1 unless instance.status == :running

      # machine is ready, ssh to it and run a commmand
      puts "Launched: You can SSH to it with;"
      puts "ssh -i #{private_key_file} #{ssh_username}@#{instance.ip_address}"
      puts "Remember to terminate after your'e done!"

      # machine is ready, ssh to it and run a commmand
      #puts "Launched: setting up Elastic IP"

      #ip = ec2.elastic_ips.allocate
      #instance.associate_elastic_ip(ip)

      #ec2.select{|ip| !ip.associated? }.each(&:release)
    end
  end

  namespace :install do
    desc "Install all CompassAE schema migrations"
    task :migrations => :environment do
      compass_ae_railties = Rails.application.config.erp_base_erp_svcs.compass_ae_engines.collect { |e| "#{e.name.split("::").first.underscore}" }.join(',')
      task = "railties:install:migrations"
      ENV['FROM'] = compass_ae_railties
      Rake::Task[task].invoke
    end #migrations

    desc "Install all CompassAE data migrations"
    task :data_migrations => :environment do
      compass_ae_railties = Rails.application.config.erp_base_erp_svcs.compass_ae_engines.collect { |e| "#{e.name.split("::").first.underscore}" }.join(',')
      task = "railties:install:data_migrations"
      ENV['FROM'] = compass_ae_railties
      Rake::Task[task].invoke
    end #data_migrations
  end #install

  desc "Upgrade you installation of Compass AE"
  task :upgrade => :environment do
    begin
      ActiveRecord::Migrator.prepare_upgrade_migrations
      RussellEdge::DataMigrator.prepare_upgrade_migrations

      Rake::Task["db:migrate"].reenable
      Rake::Task["db:migrate"].invoke

      Rake::Task["db:migrate_data"].reenable
      Rake::Task["db:migrate_data"].invoke

      ActiveRecord::Migrator.cleanup_upgrade_migrations
      RussellEdge::DataMigrator.cleanup_upgrade_migrations
    rescue Exception => ex
      ActiveRecord::Migrator.cleanup_migrations
      ActiveRecord::Migrator.cleanup_upgrade_migrations
      RussellEdge::DataMigrator.cleanup_upgrade_migrations

      puts ex.inspect
      puts ex.backtrace
    end #handle exceptions
  end #upgrade
end #compass_ae