module Knitkit
  module ErpApp
    module Desktop
      class WebsiteController < Knitkit::ErpApp::Desktop::AppController
        IGNORED_PARAMS = %w{action controller id}

        before_filter :set_website, :only => [:build_content_tree, :export, :exporttemplate, :website_publications, :set_viewing_version,
                                              :build_host_hash, :activate_publication, :publish, :update, :delete]

        def index
          render :json => {:sites => Website.all.collect { |item| item.to_hash(:only => [:id, :name, :title, :subtitle],
                                                                               :configuration_id => item.configurations.first.id,
                                                                               :url => "http://#{item.config_value('primary_host')}") }}
        end

        def build_content_tree

          tree = []

          if @website

            @website.website_sections.positioned.each do |website_section|
              tree << build_section_hash(website_section)
            end

          end

          render :json => tree
        end

        def website_publications
          sort_hash = params[:sort].blank? ? {} : Hash.symbolize_keys(JSON.parse(params[:sort]).first)
          sort = sort_hash[:property] || 'version'
          dir = sort_hash[:direction] || 'DESC'
          limit = params[:limit] || 9
          start = params[:start] || 0

          published_websites = @website.published_websites.order("#{sort} #{dir}").limit(limit).offset(start)

          #set site_version. User can view different versions. Check if they are viewing another version
          site_version = @website.active_publication.version
          if !session[:website_version].blank? && !session[:website_version].empty?
            site_version_hash = session[:website_version].find { |item| item[:website_id] == @website.id }
            site_version = site_version_hash[:version].to_f unless site_version_hash.nil?
          end

          PublishedWebsite.class_exec(site_version) do
            cattr_accessor :site_version
            self.site_version = site_version

            def viewing
              self.version == self.site_version
            end
          end

          render :inline => "{\"success\":true, \"results\":#{published_websites.count},
                            \"totalCount\":#{@website.published_websites.count},
                            \"data\":#{published_websites.to_json(
              :only => [:comment, :id, :version, :created_at, :active],
              :methods => [:viewing, :published_by_username])} }"
        end

        def activate_publication
          begin
            current_user.with_capability('activate', 'Website') do
              @website.set_publication_version(params[:version].to_f, current_user)

              render :json => {:success => true}
            end
          rescue ErpTechSvcs::Utils::CompassAccessNegotiator::Errors::UserDoesNotHaveCapability => ex
            render :json => {:success => false, :message => ex.message}
          end
        end

        def set_viewing_version
          if session[:website_version].blank?
            session[:website_version] = []
            session[:website_version] << {:website_id => @website.id, :version => params[:version]}
          else
            session[:website_version].delete_if { |item| item[:website_id] == @website.id }
            session[:website_version] << {:website_id => @website.id, :version => params[:version]}
          end

          render :json => {:success => true}
        end

        def publish
          begin
            current_user.with_capability('publish', 'Website') do
              @website.publish(params[:comment], current_user)

              render :json => {:success => true}
            end
          rescue ErpTechSvcs::Utils::CompassAccessNegotiator::Errors::UserDoesNotHaveCapability => ex
            render :json => {:success => false, :message => ex.message}
          end
        end

        def new
          begin
            Website.transaction do
              current_user.with_capability('create', 'Website') do
                website = Website.new
                website.subtitle = params[:subtitle]
                website.title = params[:title]
                website.name = params[:name]

                # create homepage
                website_section = WebsiteSection.new
                website_section.title = "Home"
                website_section.in_menu = true
                website.website_sections << website_section

                website.save
                website.setup_default_pages

                #set default publication published by user
                first_publication = website.published_websites.first
                first_publication.published_by = current_user
                first_publication.save

                website.hosts << WebsiteHost.create(:host => params[:host])
                website.configurations.first.update_configuration_item(ConfigurationItemType.find_by_internal_identifier('primary_host'), params[:host])
                website.save

                website.publish("Publish Default Sections", current_user)

                PublishedWebsite.activate(website, 1, current_user)

                render :json => {:success => true, :website => website.to_hash(:only => [:id, :name],
                                                                               :configuration_id => website.configurations.first.id,
                                                                               :url => "http://#{website.config_value('primary_host')}")}
              end
            end
          rescue => ex
            Rails.logger.error("#{ex.message} + #{ex.backtrace.join("\n")}")
            render :json => {:success => false, :message => ex.message}
          end

        end

        def update
          begin
            current_user.with_capability('edit', 'Website') do
              @website.name = params[:name]
              @website.title = params[:title]
              @website.subtitle = params[:subtitle]

              render :json => @website.save ? {:success => true} : {:success => false}
            end
          rescue ErpTechSvcs::Utils::CompassAccessNegotiator::Errors::UserDoesNotHaveCapability => ex
            render :json => {:success => false, :message => ex.message}
          end
        end

        def delete
          begin
            current_user.with_capability('delete', 'Website') do
              render :json => @website.destroy ? {:success => true} : {:success => false}
            end
          rescue ErpTechSvcs::Utils::CompassAccessNegotiator::Errors::UserDoesNotHaveCapability => ex
            render :json => {:success => false, :message => ex.message}
          end
        end

        def export
          zip_path = @website.export
          begin
            send_file(zip_path.to_s, :stream => false)
          rescue Exception => ex
            raise "Error sending #{zip_path} file"
          end
        end

        def exporttemplate
          zip_path = @website.export_template

          if zip_path == false
            render :json => {:success => false, :message => "Error sending file. Make sure you have a website and an active theme."}
          end

          begin
            send_file(zip_path, :stream => false)
          rescue Exception => ex
            raise "Error sending file. Make sure you have a website and an active theme."
          end
        end

        # TODO add role restriction to this
        def import
          website, message = Website.import(params[:website_data], current_user)

          if website
            render :inline => {:success => true, :website => website.to_hash(:only => [:id, :name])}.to_json
          else
            render :inline => {:success => false, :message => message}.to_json
          end
        ensure
          FileUtils.rm_r File.dirname(zip_path) rescue nil
        end

        def importtemplate
          website, message = Website.import_template_director(params[:website_data], User.first)

          if website
            render :inline => {:success => true, :website => website.to_hash(:only => [:id, :name])}.to_json
          else
            render :inline => {:success => false, :message => message}.to_json
          end
        end

      end # WebsiteController
    end # Desktop
  end # ErpApp
end # Knitkit
