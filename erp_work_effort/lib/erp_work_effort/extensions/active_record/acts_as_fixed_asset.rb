module ErpWorkEffort
  module Extensions
    module ActiveRecord
      module ActsAsFixedAsset

        def self.included(base)
          base.extend(ClassMethods)
        end

        module ClassMethods
          def acts_as_fixed_asset
            extend ActsAsFixedAsset::SingletonMethods
            include ActsAsFixedAsset::InstanceMethods

            after_initialize :initialize_fixed_asset
            after_create :save_fixed_asset
            after_update :save_fixed_asset
            after_destroy :destroy_fixed_asset

            has_one :fixed_asset, :as => :fixed_asset_record

            #Methods delegated to FixedAsset
            [ :description,:description=,
            ].each { |m| delegate m, :to => :fixed_asset }
          end
        end

        module SingletonMethods
        end

        module InstanceMethods
          def root_asset
            self.fixed_asset
          end

          def save_fixed_asset
            self.fixed_asset.save
          end

          def initialize_fixed_asset
            if self.new_record? and self.fixed_asset.nil?
              fa = FixedAsset.new
              self.fixed_asset = fa
              fa.fixed_asset_record = self
            end
          end

          def destroy_fixed_asset
            self.fixed_asset.destroy if (self.fixed_asset && !self.fixed_asset.frozen?)
          end
        end

      end
    end
  end
end