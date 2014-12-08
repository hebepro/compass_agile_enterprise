class Website < ActiveRecord::Base
  attr_protected :created_at, :updated_at

  after_destroy :remove_sites_directory, :remove_website_role
  before_destroy :destroy_sections
  after_create :setup_website

  protected_with_capabilities
  has_file_assets

  extend FriendlyId
  friendly_id :name, :use => [:slugged], :slug_column => :internal_identifier

  def should_generate_new_friendly_id?
    new_record? and self.internal_identifier.nil?
  end

  has_many :published_websites, :dependent => :destroy
  has_many :website_hosts, :dependent => :destroy
  has_many :website_navs, :dependent => :destroy
  has_many :website_inquiries, :dependent => :destroy
  has_many :website_party_roles, :dependent => :destroy
  has_many :parties, :through => :website_party_roles do
    def owners
      where('role_type_id = ?', RoleType.website_owner)
    end
  end
  has_many :website_sections, :order => :lft do
    def paths
      collect { |website_section| website_section.paths }.flatten
    end

    #have to do a sort by to override what awesome nested set does for the order by (lft)
    def positioned
      where('parent_id is null').sort_by!(&:position)
    end

    def update_paths!
      all.each { |section| section.self_and_descendants.each { |_section| _section.update_path! } }
    end
  end

  alias :sections :website_sections

  has_many :online_document_sections, :dependent => :destroy, :order => :lft, :class_name => 'OnlineDocumentSection'

  has_many :themes, :dependent => :destroy do
    def active
      where('active = 1')
    end
  end

  validates_uniqueness_of :internal_identifier, :case_sensitive => false

  alias :sections :website_sections
  alias :hosts :website_hosts

  #We only want to destroy parent sections as better nested set will destroy children for us
  def destroy_sections
    parents = []
    website_sections.each do |section|
      unless section.child?
        parents << section
      end
    end

    parents.each { |parent| parent.destroy }
  end

  def publishing?
    self.publishing
  end

  def to_label
    self.name
  end

  # creating method because we only want a getter, not a setter for iid
  def iid
    self.internal_identifier
  end

  def add_party_with_role(party, role_type)
    self.website_party_roles << WebsitePartyRole.create(:party => party, :role_type => role_type)
    self.save
  end

  def all_section_paths
    WebsiteSection.select(:path).where(:website_id => self.id).collect { |row| row['path'] }
  end

  def config_value(config_item_type_iid)
    primary_host_config_item_type = ConfigurationItemType.find_by_internal_identifier(config_item_type_iid)
    self.configurations.first.get_configuration_item(primary_host_config_item_type).options.first.value
  end

  def email_inquiries?
    config_value('email_inquiries') == 'yes'
  end

  def self.find_by_host(host)
    website = nil
    unless host.nil?
      website_host = WebsiteHost.find_by_host(host)
      website = website_host.website unless website_host.nil?
    end
    website
  end

  def deactivate_themes!
    themes.each do |theme|
      theme.deactivate!
    end
  end

  def publish_element(comment, element, version, current_user)
    self.published_websites.last.publish_element(comment, element, version, current_user)
  end

  def publish(comment, current_user)
    self.published_websites.last.publish(comment, current_user)
  end

  def set_publication_version(version, current_user)
    PublishedWebsite.activate(self, version, current_user)
  end

  def active_publication
    self.published_websites.where(:active => true).first
  end

  def auto_activate_publication?
    configuration_item = self.configurations.first.get_item(:auto_active_publications)
    unless configuration_item.nil?
      configuration_item.options.first.value == 'yes'
    else
      false
    end
  end

  def publish_on_save?
    configuration_item = self.configurations.first.get_item(:publish_on_save)
    unless configuration_item.nil?
      configuration_item.options.first.value == 'yes'
    else
      false
    end
  end

  def role
    SecurityRole.iid(website_role_iid)
  end

  def setup_website
    PublishedWebsite.create(:website => self, :version => 0, :active => true, :comment => 'New Site Created')
    SecurityRole.create(:description => "Website #{self.title}", :internal_identifier => website_role_iid) if self.role.nil?
    configuration = ::Configuration.find_template('default_website_configuration').clone(true, "Website #{self.title} Configuration", "Website #{self.title} Configuration".underscore)
    configuration.update_configuration_item(ConfigurationItemType.find_by_internal_identifier('login_url'), '/login')
    configuration.update_configuration_item(ConfigurationItemType.find_by_internal_identifier('homepage_url'), '/home')
    self.configurations << configuration
    self.save
  end

  def remove_sites_directory
    file_support = ErpTechSvcs::FileSupport::Base.new(:storage => Rails.application.config.erp_tech_svcs.file_storage)
    begin
      file_support.delete_file(File.join(file_support.root, "sites/#{self.iid}"), :force => true)
    rescue
      #do nothing it may not exist
    end
  end

  def remove_website_role
    role.destroy if role
  end

  def setup_default_pages
    # create default sections for each widget using widget layout
    widget_classes = [
        ::Widgets::ContactUs::Base,
        ::Widgets::Search::Base,
        ::Widgets::ManageProfile::Base,
        ::Widgets::Login::Base,
        ::Widgets::Signup::Base,
        ::Widgets::ResetPassword::Base
    ]
    profile_page = nil
    widget_classes.each do |widget_class|
      website_section = WebsiteSection.new
      website_section.title = widget_class.title
      website_section.in_menu = true unless ["Login", "Sign Up", "Reset Password"].include?(widget_class.title)
      website_section.layout = widget_class.base_layout
      website_section.save

      profile_page = website_section if widget_class.title == 'Manage Profile'

      self.website_sections << website_section
    end
    self.save
    self.website_sections.update_paths!
    profile_page.secure unless profile_page.nil?
  end

  def export_setup
    setup_hash = {
        :name => name,
        :hosts => hosts.collect(&:host),
        :title => title,
        :subtitle => subtitle,
        :internal_identifier => internal_identifier,
        :sections => [],
        :images => [],
        :files => [],
        :website_navs => []
    }

    #TODO update to handle configurations

    setup_hash[:sections] = sections.positioned.collect do |website_section|
      website_section.build_section_hash
    end

    setup_hash[:website_navs] = website_navs.collect do |website_nav|
      {
          :name => website_nav.name,
          :items => website_nav.items.positioned.map { |website_nav_item| website_nav_item.build_menu_item_hash }
      }
    end

    self.files.where("directory like '%/sites/#{self.iid}/images%'").all.each do |image_asset|
      setup_hash[:images] << {:path => image_asset.directory, :name => image_asset.name}
    end

    self.files.where("directory like '%/#{Rails.application.config.erp_tech_svcs.file_assets_location}/sites/#{self.iid}%'").all.each do |file_asset|
      setup_hash[:files] << {:path => file_asset.directory, :name => file_asset.name, :roles => file_asset.roles.uniq.collect { |r| r.internal_identifier }}
    end

    setup_hash
  end

  def export
    tmp_dir = Website.make_tmp_dir
    file_support = ErpTechSvcs::FileSupport::Base.new(:storage => Rails.application.config.erp_tech_svcs.file_storage)

    sections_path = Pathname.new(File.join(tmp_dir, 'sections'))
    FileUtils.mkdir_p(sections_path) unless sections_path.exist?

    articles_path = Pathname.new(File.join(tmp_dir, 'articles'))
    FileUtils.mkdir_p(articles_path) unless articles_path.exist?

    documented_contents_path = Pathname.new(File.join(tmp_dir, 'documented contents'))
    FileUtils.mkdir_p(documented_contents_path) unless documented_contents_path.exist?

    excerpts_path = Pathname.new(File.join(tmp_dir, 'excerpts'))
    FileUtils.mkdir_p(excerpts_path) unless excerpts_path.exist?

    image_assets_path = Pathname.new(File.join(tmp_dir, 'images'))
    FileUtils.mkdir_p(image_assets_path) unless image_assets_path.exist?

    file_assets_path = Pathname.new(File.join(tmp_dir, 'files'))
    FileUtils.mkdir_p(file_assets_path) unless file_assets_path.exist?

    sections.where('parent_id is null').each do |website_section|
      save_section_layout_to_file(sections_path, website_section)
    end

    contents = sections.collect(&:contents).flatten.uniq
    contents.each do |content|
      File.open(File.join(articles_path, "#{content.internal_identifier}.html"), 'wb+') { |f| f.puts(content.body_html) }
      unless content.excerpt_html.blank?
        File.open(File.join(excerpts_path, "#{content.internal_identifier}.html"), 'wb+') { |f| f.puts(content.excerpt_html) }
      end
    end

    online_document_sections.each do |online_documented_section|
      extension = online_documented_section.use_markdown == true ? 'md' : 'html'
      File.open(File.join(documented_contents_path, "#{online_documented_section.internal_identifier}.#{extension}"), 'wb+') { |f| f.puts(online_documented_section.documented_item_published_content_html(active_publication)) }
    end

    self.files.where("directory like '%/sites/#{self.iid}/images%'").all.each do |image_asset|
      contents = file_support.get_contents(File.join(file_support.root, image_asset.directory, image_asset.name))
      FileUtils.mkdir_p(File.join(image_assets_path, image_asset.directory))
      File.open(File.join(image_assets_path, image_asset.directory, image_asset.name), 'wb+') { |f| f.puts(contents) }
    end

    self.files.where("directory like '%/#{Rails.application.config.erp_tech_svcs.file_assets_location}/sites/#{self.iid}%'").all.each do |file_asset|
      contents = file_support.get_contents(File.join(file_support.root, file_asset.directory, file_asset.name))
      FileUtils.mkdir_p(File.join(file_assets_path, file_asset.directory))
      File.open(File.join(file_assets_path, file_asset.directory, file_asset.name), 'wb+') { |f| f.puts(contents) }
    end

    files = []
    Dir.glob("#{tmp_dir.to_s}/**/*").each do |entry|
      next if entry =~ /^\./
      path = entry
      entry = entry.gsub(Regexp.new(tmp_dir.to_s), '')
      entry = entry.gsub(Regexp.new(/^\//), '')
      files << {:path => path, :name => entry}
    end

    File.open(tmp_dir + 'setup.yml', 'wb+') { |f| f.puts(export_setup.to_yaml) }

    (tmp_dir + "#{name}.zip").tap do |file_name|
      file_name.unlink if file_name.exist?
      Zip::ZipFile.open(file_name.to_s, Zip::ZipFile::CREATE) do |zip|
        files.each { |file| zip.add(file[:name], file[:path]) if File.exists?(file[:path]) }
        zip.add('setup.yml', tmp_dir + 'setup.yml')
      end
    end

  end

  def save_section_layout_to_file(sections_path, website_section)
    unless website_section.layout.blank?
      File.open(File.join(sections_path, "#{website_section.permalink}.rhtml"), 'wb+') { |f| f.puts(website_section.layout) }
    end

    # we need to handle child sections because internal identifier uniqueness is scoped by parent_id and website_id
    # get all children of this section
    unless website_section.children.empty?
      sections_path = Pathname.new(File.join(sections_path, website_section.permalink))
      FileUtils.mkdir_p(sections_path) unless sections_path.exist?

      website_section.children.each do |website_section_child|
        save_section_layout_to_file(sections_path, website_section_child)
      end
    end
  end

  def export_template
    tmp_dir = Website.make_tmp_dir
    template_zip_path = export

    if !themes.active.first.is_a?(Theme)
      return false
    end

    theme_zip_path = themes.active.first.export

    zip_file_name = File.join(tmp_dir, self.iid + '-composite.zip')

    Zip::ZipFile.open(zip_file_name, Zip::ZipFile::CREATE) do |zip_file|
      zip_file.add(File.basename(template_zip_path, '.zip') + '-template.zip', template_zip_path)
      zip_file.add(File.basename(theme_zip_path, '.zip') + '-theme.zip', theme_zip_path)
    end

    File.join(tmp_dir, self.iid + '-composite.zip')
  end

  class << self
    def make_tmp_dir
      Pathname.new(File.join(Rails.root, "/tmp/website_export/tmp_#{Time.now.to_i.to_s}")).tap do |dir|
        FileUtils.mkdir_p(dir) unless dir.exist?
      end
    end

    def import(file, current_user)
      file_support = ErpTechSvcs::FileSupport::Base.new(:storage => Rails.application.config.erp_tech_svcs.file_storage)
      message = ''
      website = nil

      file = ActionController::UploadedTempfile.new("uploaded-theme").tap do |f|
        f.puts file.read
        f.original_filename = file.original_filename
        f.read # no idea why we need this here, otherwise the zip can't be opened
      end unless file.path

      entries = []
      setup_hash = nil

      tmp_dir = Website.make_tmp_dir
      Zip::ZipFile.open(file.path) do |zip|
        zip.each do |entry|
          f_path = File.join(tmp_dir.to_s, entry.name)
          FileUtils.mkdir_p(File.dirname(f_path))
          zip.extract(entry, f_path) unless File.exist?(f_path)

          next if entry.name =~ /__MACOSX\//
          if entry.name =~ /setup.yml/
            data = ''
            entry.get_input_stream { |io| data = io.read }
            data = StringIO.new(data) if data.present?
            setup_hash = YAML.load(data)
          else
            type = entry.name.split('/')[0]
            name = entry.name.split('/').last
            next if name.nil?

            if File.exist?(f_path) and !File.directory?(f_path)
              entry_hash = {:type => type, :name => name, :path => entry.name}
              entries << entry_hash unless name == 'sections' || name == 'articles' || name == 'excerpts' || name == 'documented contents'
              entry_hash[:data] = File.open(f_path, "rb") { |io| io.read }
            end
          end

        end
      end
      entries.uniq!
      FileUtils.rm_rf(tmp_dir.to_s)

      if Website.find_by_internal_identifier(setup_hash[:internal_identifier]).nil?
        website = Website.new(
            :name => setup_hash[:name],
            :title => setup_hash[:title],
            :subtitle => setup_hash[:subtitle],
            :internal_identifier => setup_hash[:internal_identifier]
        )

        #TODO update to handle configurations

        website.save!

        #set default publication published by user
        first_publication = website.published_websites.first
        first_publication.published_by = current_user
        first_publication.save

        begin
          #handle images
          # entries.each do |entry|
          #   puts "entry type '#{entry[:type]}'"
          #   puts "entry name '#{entry[:name]}'"
          #   puts "entry path '#{entry[:path]}'"
          #   puts "entry data #{!entry[:data].blank?}"
          # end
          # puts "------------------"
          setup_hash[:images].each do |image_asset|
            filename = 'images' + image_asset[:path] + '/' + image_asset[:name]
            #puts "image_asset '#{filename}'"
            content = entries.find { |entry| entry[:type] == 'images' and entry[:path] == filename }
            unless content.nil?
              website.add_file(content[:data], File.join(file_support.root, image_asset[:path], image_asset[:name]))
            end
          end

          #handle files
          setup_hash[:files].each do |file_asset|
            filename = 'files' + file_asset[:path] + '/' + file_asset[:name]
            #puts "file_asset '#{filename}'"
            content = entries.find { |entry| entry[:type] == 'files' and entry[:path] == filename }
            unless content.nil?
              file = website.add_file(content[:data], File.join(file_support.root, file_asset[:path], file_asset[:name]))

              #handle security
              unless file_asset[:roles].empty?
                capability = file.add_capability(:download)
                file_asset[:roles].each do |role_iid|
                  role = SecurityRole.find_by_internal_identifier(role_iid)
                  role.add_capability(capability)
                end
              end
            end
          end

          #handle hosts
          setup_hash[:hosts].each do |host|
            website.hosts << WebsiteHost.create(:host => host)
            website.save
          end

          if !setup_hash[:hosts].blank? and !setup_hash[:hosts].empty?
            #set first host as primary host in configuration
            website.configurations.first.update_configuration_item(ConfigurationItemType.find_by_internal_identifier('primary_host'), setup_hash[:hosts].first)
            website.save
          end

          #handle sections
          setup_hash[:sections].each do |section_hash|
            build_section(section_hash, entries, website, current_user)
          end
          website.website_sections.update_paths!

          #handle website_navs
          setup_hash[:website_navs].each do |website_nav_hash|
            website_nav = WebsiteNav.new(:name => website_nav_hash[:name])
            website_nav_hash[:items].each do |item|
              website_nav.website_nav_items << build_menu_item(item)
            end
            website.website_navs << website_nav
          end

          website.publish("Website Imported", current_user)

        rescue => ex
          Rails.logger.error "#{ex.inspect} #{ex.backtrace}"
          website.destroy unless website.nil?
          raise ex
        end

        website.save
      else
        message = 'Website already exists with that internal_identifier'
      end

      return website, message
    end

    def import_template_director(file, current_user)
      file_object = file.tempfile
      file_path = file_object.path

      entries = []
      begin
        Zip::ZipFile.open(file_path) { |zip_file|
          zip_file.each { |f|
            f_path=File.join('public/waste', f.name)
            FileUtils.mkdir_p(File.dirname(f_path))
            zip_file.extract(f, f_path) unless File.exist?(f_path)
            entries << f.name
          }
        }

        entries.each do |entry|
          if entry.match(/-template.zip/)
            @website_result = import_template('public/waste/' + entry, current_user)
          end
        end
        entries.each do |entry|
          if entry.match(/-theme.zip/)
            Theme.import_download_item('public/waste/' + entry, @website_result[0])
          end
        end
        return @website_result[0], @website_result[1]
      rescue Exception => e
        return false, "Error"
      end
    end

    def import_template(file, current_user)
      file_support = ErpTechSvcs::FileSupport::Base.new(:storage => Rails.application.config.erp_tech_svcs.file_storage)
      message = ''
      website = nil

      entries = []
      setup_hash = nil

      tmp_dir = Website.make_tmp_dir

      Zip::ZipFile.open(file) do |zip|#passing in a file
        #Zip::ZipFile.open(file.path) do |zip|
        zip.each do |entry|
          f_path = File.join(tmp_dir.to_s, entry.name)
          FileUtils.mkdir_p(File.dirname(f_path))
          zip.extract(entry, f_path) unless File.exist?(f_path)

          next if entry.name =~ /__MACOSX\//
          if entry.name =~ /setup.yml/
            data = ''
            entry.get_input_stream { |io| data = io.read }
            data = StringIO.new(data) if data.present?
            setup_hash = YAML.load(data)
          else
            type = entry.name.split('/')[0]
            name = entry.name.split('/').last
            next if name.nil?

            if File.exist?(f_path) and !File.directory?(f_path)
              entry_hash = {:type => type, :name => name, :path => entry.name}
              entries << entry_hash unless name == 'sections' || name == 'articles' || name == 'excerpts' || name == 'documented contents'
              entry_hash[:data] = File.open(f_path, "rb") { |io| io.read }
            end
          end

        end
      end
      entries.uniq!
      FileUtils.rm_rf(tmp_dir.to_s)

      if Website.find_by_internal_identifier(setup_hash[:internal_identifier]).nil?
        website = Website.new(
            :name => setup_hash[:name],
            :title => setup_hash[:title],
            :subtitle => setup_hash[:subtitle],
            :internal_identifier => setup_hash[:internal_identifier]
        )

        #TODO update to handle configurations

        website.save!

        #set default publication published by user
        first_publication = website.published_websites.first
        first_publication.published_by = current_user
        first_publication.save

        begin
          #handle images
          # entries.each do |entry|
          #   puts "entry type '#{entry[:type]}'"
          #   puts "entry name '#{entry[:name]}'"
          #   puts "entry path '#{entry[:path]}'"
          #   puts "entry data #{!entry[:data].blank?}"
          # end
          # puts "------------------"
          setup_hash[:images].each do |image_asset|
            filename = 'images' + image_asset[:path] + '/' + image_asset[:name]
            #puts "image_asset '#{filename}'"
            content = entries.find { |entry| entry[:type] == 'images' and entry[:path] == filename }
            unless content.nil?
              website.add_file(content[:data], File.join(file_support.root, image_asset[:path], image_asset[:name]))
            end
          end

          #handle files
          setup_hash[:files].each do |file_asset|
            filename = 'files' + file_asset[:path] + '/' + file_asset[:name]
            #puts "file_asset '#{filename}'"
            content = entries.find { |entry| entry[:type] == 'files' and entry[:path] == filename }
            unless content.nil?
              file = website.add_file(content[:data], File.join(file_support.root, file_asset[:path], file_asset[:name]))

              #handle security
              unless file_asset[:roles].empty?
                capability = file.add_capability(:download)
                file_asset[:roles].each do |role_iid|
                  role = SecurityRole.find_by_internal_identifier(role_iid)
                  role.add_capability(capability)
                end
              end
            end
          end

          #handle hosts
          if WebsiteHost.last
          setup_hash.merge(:hosts => 'localhost:3000')
          end

          if !setup_hash[:hosts].blank? and !setup_hash[:hosts].empty?
            #set first host as primary host in configuration
            website.configurations.first.update_configuration_item(ConfigurationItemType.find_by_internal_identifier('primary_host'), 'localhost:3000')
            website.save
          end

          #handle sections
          setup_hash[:sections].each do |section_hash|
            build_section(section_hash, entries, website, current_user)
          end
          website.website_sections.update_paths!

          #handle website_navs
          setup_hash[:website_navs].each do |website_nav_hash|
            website_nav = WebsiteNav.new(:name => website_nav_hash[:name])
            website_nav_hash[:items].each do |item|
              website_nav.website_nav_items << build_menu_item(item)
            end
            website.website_navs << website_nav
          end

          website.publish("Website Imported", current_user)

        rescue Exception => ex
          Rails.logger.error "#{ex.inspect} #{ex.backtrace}"
          website.destroy unless website.nil?
          raise ex
        end

        website.save
      else
        message = 'Website already exists with that internal_identifier'
      end

      return website, message
    end


    def find_site_entry_in_zip(file)
      zf = Zip::ZipFile.open(file)
      zf.each_with_index {  |entry, index|
        if entry.name.match(/-template.zip/) && !entry.name.match(/_./)
          return entry
        end
      }
    end

    def find_theme_entries_in_zip(file)
      entries = []
      zf = Zip::ZipFile.new(file)
      zf.each_with_index {  |entry, index|
        if entry.name.match(/-theme.zip/) && !entry.name.match(/_./)
          entries << entry
        end
      }
      entries
    end


    protected


    def build_menu_item(hash)
      website_item = WebsiteNavItem.new(
          :title => hash[:title],
          :url => hash[:url],
          :position => hash[:position]
      )
      unless hash[:linked_to_item_type].blank?
        website_item.linked_to_item = WebsiteSection.find_by_path(hash[:linked_to_item_path])
      end
      website_item.save
      hash[:items].each do |item|
        child_website_item = build_menu_item(item)
        child_website_item.move_to_child_of(website_item)
      end

      #handle security
      unless hash[:roles].empty?
        capability = website_item.add_capability(:view)
        hash[:roles].each do |role_iid|
          role = SecurityRole.find_by_internal_identifier(role_iid)
          role.add_capability(capability)
        end
      end

      website_item
    end

    def build_section(hash, entries, website, current_user)
      klass = hash[:type].constantize
      section = klass.new(:title => hash[:name],
                          :in_menu => hash[:in_menu],
                          :render_base_layout => hash[:render_base_layout],
                          :position => hash[:position],
                          :render_base_layout => hash[:render_base_layout])
      section.internal_identifier = hash[:internal_identifier]
      section.permalink = hash[:permalink]
      section.path = hash[:path]
      content = entries.find do |entry|
        entry[:type] == 'sections' and entry[:name] == "#{hash[:permalink]}.rhtml" and entry[:path].split('.')[0] == "sections#{hash[:path]}"
      end

      section.layout = content[:data] unless content.nil?

      hash[:articles].each do |article_hash|
        article = Article.find_by_internal_identifier(article_hash[:internal_identifier])
        if article.nil?
          article = Article.new(:title => article_hash[:name], :display_title => article_hash[:display_title])
          article.created_by = current_user
          article.tag_list = article_hash[:tag_list].split(',').collect { |t| t.strip() } unless article_hash[:tag_list].blank?
          article.body_html = entries.find { |entry| entry[:type] == 'articles' and entry[:name] == "#{article_hash[:internal_identifier]}.html" }[:data]
          content = entries.find { |entry| entry[:type] == 'excerpts' and entry[:name] == "#{article_hash[:internal_identifier]}.html" }
          unless content.nil?
            article.excerpt_html = content[:data]
          end
        end
        section.contents << article
        section.save
        article.update_content_area_and_position_by_section(section, article_hash[:content_area], article_hash[:position])
      end
      website.website_sections << section
      section.save
      if hash[:sections]
        hash[:sections].each do |section_hash|
          child_section = build_section(section_hash, entries, website, current_user)
          child_section.move_to_child_of(section)
        end
      end
      if section.is_a? OnlineDocumentSection
        section.use_markdown = hash[:use_markdown]
        section.save
        extension_type = hash[:use_markdown] ? 'md' : 'html'
        entry_data = entries.find { |entry| entry[:type] == 'documented contents' and entry[:name] == "#{section.internal_identifier}.#{extension_type}" }[:data]
        documented_content = DocumentedContent.create(:title => section.title, :body_html => entry_data)
        DocumentedItem.create(:documented_content_id => documented_content.id, :online_document_section_id => section.id)
      end
      if hash[:online_document_sections]
        hash[:online_document_sections].each do |section_hash|
          child_section = build_section(section_hash, entries, website, current_user)
          child_section.use_markdown = section_hash[:use_markdown]
          child_section.save
          child_section.move_to_child_of(section)
          # CREATE THE DOCUMENTED CONTENT HERE
          extension_type = section_hash[:use_markdown] ? 'md' : 'html'
          entry_data = entries.find { |entry| entry[:type] == 'documented contents' and entry[:name] == "#{child_section.internal_identifier}.#{extension_type}" }[:data]
          documented_content = DocumentedContent.create(:title => child_section.title, :body_html => entry_data)
          DocumentedItem.create(:documented_content_id => documented_content.id, :online_document_section_id => child_section.id)
        end
      end

      #handle security
      if hash[:roles] #if this is a OnlineDocumentSection will not have roles
        unless hash[:roles].empty?
          capability = section.add_capability(:view)
          hash[:roles].each do |role_iid|
            role = SecurityRole.find_by_internal_identifier(role_iid)
            if role.nil?
              role = SecurityRole.create(internal_identifier: role_iid, description: role_iid.humanize)
            end
            role.add_capability(capability)
          end
        end
      end

      section
    end


  end

  def website_role_iid
    "website_#{self.iid}_access"
  end
end
