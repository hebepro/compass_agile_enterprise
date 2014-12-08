class CommunicationEvent < ActiveRecord::Base
  attr_protected :created_at, :updated_at

  belongs_to :from_party, :class_name => 'Party', :foreign_key => 'party_id_from'
  belongs_to :to_party ,  :class_name => 'Party', :foreign_key => 'party_id_to'
  
  belongs_to :from_role , :class_name => 'RoleType', :foreign_key => 'role_type_id_from'
  belongs_to :to_role ,   :class_name => 'RoleType', :foreign_key => 'role_type_id_to'

  belongs_to :comm_evt_status, :class_name => 'CommEvtStatus', :foreign_key => 'status_type_id'

  belongs_to :from_contact_mechanism, :polymorphic => true
  belongs_to :to_contact_mechanism, :polymorphic => true

  has_and_belongs_to_many :comm_evt_purpose_types, :join_table => 'comm_evt_purposes'

  validates_presence_of :from_role
  validates_presence_of :from_party

  # serialize ExtJs attributes
  is_json :custom_fields

  def to_label
    "#{short_description}"
  end  

end
