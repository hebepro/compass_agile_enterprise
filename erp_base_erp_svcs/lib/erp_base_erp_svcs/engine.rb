require 'has_many_polymorphic'
require 'attr_encrypted'
require 'awesome_nested_set'
require 'data_migrator'

module ErpBaseErpSvcs
  class Engine < Rails::Engine
    isolate_namespace ErpBaseErpSvcs

    config.erp_base_erp_svcs = ErpBaseErpSvcs::Config

    ActiveSupport.on_load(:active_record) do
      include ErpBaseErpSvcs::Extensions::ActiveRecord::IsDescribable
      include ErpBaseErpSvcs::Extensions::ActiveRecord::HasNotes
      include ErpBaseErpSvcs::Extensions::ActiveRecord::ActsAsNoteType
      include ErpBaseErpSvcs::Extensions::ActiveRecord::ActsAsErpType
      include ErpBaseErpSvcs::Extensions::ActiveRecord::ActsAsCategory
      include ErpBaseErpSvcs::Extensions::ActiveRecord::HasContact
      include ErpBaseErpSvcs::Extensions::ActiveRecord::ActsAsFixedAsset
      include ErpBaseErpSvcs::Extensions::ActiveRecord::ActsAsFacility
      extend ErpBaseErpSvcs::Extensions::ActiveRecord::StiInstantiation::ActMacro
    end

    ErpBaseErpSvcs.register_as_compass_ae_engine(config, self)

  end
end
