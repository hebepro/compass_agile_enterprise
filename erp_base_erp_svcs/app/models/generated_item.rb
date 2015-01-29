class GeneratedItem < ActiveRecord::Base
  attr_protected :created_at, :updated_at

  belongs_to :generated_record, :polymorphic => true
  belongs_to :generated_by, :polymorphic => true
  
end