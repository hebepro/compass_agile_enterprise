module ErpTechSvcs
  module Extensions
    module ActiveRecord
      module HasFileAssets

        def self.included(base)
          base.extend(ClassMethods)
        end

        # If set to auto destroy any files related to a model via this mixin will automatically be removed
        # regardless of any other relationships they have.  It defaults to true since most files
        # should be removed when the model is removed.
        module ClassMethods
          def has_file_assets(auto_destroy=true)
            extend HasFileAssets::SingletonMethods
            include HasFileAssets::InstanceMethods

            if auto_destroy
              before_destroy :destroy_all_files
            end

            has_many :file_asset_holders,
                     :as => :file_asset_holder,
                     :dependent => :destroy

            has_many :files,
                     :through => :file_asset_holders,
                     :class_name => 'FileAsset',
                     :source => :file_asset,
                     :include => :capabilities
          end
        end

        module SingletonMethods
        end

        module InstanceMethods

          # Capabilites can be passed via a hash
          # {
          #   :download => ['admin', 'employee'],
          #   :edit     => ['admin']
          # }
          #
          def add_file(data, path=nil, capabilities=nil)
            file_asset = FileAsset.create!(:base_path => path, :data => data)

            # set capabilites if they are passed
            capabilities.each do |capability_type, roles|
              file_asset.add_capability(capability_type, nil, roles)
            end if capabilities

            self.files << file_asset
            self.save

            file_asset
          end

          def images
            self.files.where('type = ?', 'Image')
          end

          def templates
            self.files.where('type = ?', 'Template')
          end

          def stylesheets
            self.files.where('type = ?', 'Stylesheet')
          end

          def pdfs
            self.files.where('type = ?', 'Pdf')
          end

          def xmls
            self.files.where('type = ?', 'XmlFile')
          end

          # destroy all files related to this model regardless of other relationships
          def destroy_all_files
            statement = "delete from file_assets where id in (select file_asset_id from file_asset_holders where (file_asset_holder_type = '#{self.class.to_s}' or file_asset_holder_type = '#{self.class.superclass.to_s}' ) and file_asset_holder_id = #{self.id} )"

            ::ActiveRecord::Base.connection.execute(statement)
          end

        end

      end # HasFileAssets
    end # ActiveRecord
  end # Extensions
end # ErpTechSvcs