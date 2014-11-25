class NoteType < ActiveRecord::Base
  attr_protected :created_at, :updated_at
  
  acts_as_nested_set
  acts_as_erp_type

  belongs_to :note_type_record, :polymorphic => true
  has_many   :notes

  def self.iid(internal_identifier)
    find_by_internal_identifier(internal_identifier)
  end
end
