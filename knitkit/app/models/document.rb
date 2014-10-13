class Document < ActiveRecord::Base
  attr_protected :created_at, :updated_at

  # to be removed
  DOCUMENT_DYNAMIC_ATTRIBUTE_PREFIX = 'dyn_'
  
  has_dynamic_attributes :dynamic_attribute_prefix => DOCUMENT_DYNAMIC_ATTRIBUTE_PREFIX, :destroy_dynamic_attribute_for_nil => false

  # serialize custom attributes
  is_json :custom_fields
  
  has_file_assets

  belongs_to :document_record, :polymorphic => true
  belongs_to :document_type

  # to be removed
  class << self
    def add_dyn_prefix(field)
      "#{DOCUMENT_DYNAMIC_ATTRIBUTE_PREFIX}#{field}"
    end
    
    def remove_dyn_prefix(field)
      field.gsub(DOCUMENT_DYNAMIC_ATTRIBUTE_PREFIX, '')
    end
  end
  
  def set_dyn_attribute(field, value)
    self.send("#{Document.add_dyn_prefix(field)}=", value)
  end
  
end
