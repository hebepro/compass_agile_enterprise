class Document < ActiveRecord::Base
  attr_protected :created_at, :updated_at

  # serialize custom attributes
  is_json :custom_fields
  
  has_file_assets

  belongs_to :document_record, :polymorphic => true
  belongs_to :document_type
  
end
