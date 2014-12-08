class Party < ActiveRecord::Base
  attr_protected :created_at, :updated_at

  has_notes

  has_many :contacts, :dependent => :destroy
  has_many :created_notes, :class_name => 'Note', :foreign_key => 'created_by_id'
  belongs_to :business_party, :polymorphic => true

  has_many :party_roles, :dependent => :destroy #role_types
  has_many :role_types, :through => :party_roles

  after_destroy :destroy_business_party, :destroy_party_relationships

  attr_reader :relationships
  attr_writer :create_relationship

  # serialize ExtJs attributes
  is_json :custom_fields
  
  # Gathers all party relationships that contain this particular party id
  # in either the from or to side of the relationship.
  def relationships
    @relationships ||= PartyRelationship.where('party_id_from = ? or party_id_to = ?', id, id)
  end

  def to_relationships
    @relationships ||= PartyRelationship.where('party_id_to = ?', id)
  end

  def from_relationships
    @relationships ||= PartyRelationship.where('party_id_from = ?', id)
  end

  def find_relationships_by_type(relationship_type_iid)
    PartyRelationship.includes(:relationship_type).
        where('party_id_from = ? or party_id_to = ?', id, id).
        where('relationship_types.internal_identifier' => relationship_type_iid.to_s)
  end

  # Creates a new PartyRelationship for this particular
  # party instance.
  def create_relationship(description, to_party_id, reln_type)
    PartyRelationship.create(:description => description,
                             :relationship_type => reln_type,
                             :party_id_from => id,
                             :from_role => reln_type.valid_from_role,
                             :party_id_to => to_party_id,
                             :to_role => reln_type.valid_to_role)
  end

  # Callbacks
  def destroy_business_party
    if self.business_party
      self.business_party.destroy
    end
  end

  def destroy_party_relationships
    PartyRelationship.destroy_all("party_id_from = #{id} or party_id_to = #{id}")
  end

  def has_role_type?(*passed_roles)
    result = false
    passed_roles.flatten!
    passed_roles.each do |role|
      role_iid = role.is_a?(RoleType) ? role.internal_identifier : role.to_s
      self.role_types.each do |this_role|
        result = true if (this_role.internal_identifier == role_iid)
        break if result
      end
      break if result
    end
    result
  end

  def has_phone_number?(phone_number)
    result = nil
    self.contacts.each do |c|
      if c.contact_mechanism_type == 'PhoneNumber'
        if c.contact_mechanism.phone_number == phone_number
          result = true
        end
      end
    end
    result
  end

  def has_zip_code?(zip)
    result = nil
    self.contacts.each do |c|
      if c.contact_mechanism_type == 'PostalAddress'
        if c.contact_mechanism.zip == zip
          result = true
        end
      end
    end
    result
  end

  # Alias for to_s
  def to_label
    to_s
  end

  def to_s
    "#{description}"
  end

  #************************************************************************************************
  #** Contact Methods
  #************************************************************************************************

  def primary_phone_number
    contact_mechanism = nil

    contact = self.get_primary_contact(PhoneNumber)
    contact_mechanism = contact.contact_mechanism unless contact.nil?

    contact_mechanism
  end

  alias primary_phone primary_phone_number

  def primary_phone_number=(phone_number)
    self.set_primary_contact(PhoneNumber, phone_number)
  end

  alias primary_phone= primary_phone_number=

  def primary_email_address
    contact_mechanism = nil

    contact = self.get_primary_contact(EmailAddress)
    contact_mechanism = contact.contact_mechanism unless contact.nil?

    contact_mechanism
  end

  alias primary_email primary_email_address

  def primary_email_address=(email_address)
    self.set_primary_contact(EmailAddress, email_address)
  end

  alias primary_email= primary_email_address=

  def primary_postal_address
    contact_mechanism = nil

    contact = self.get_primary_contact(PostalAddress)
    contact_mechanism = contact.contact_mechanism unless contact.nil?

    contact_mechanism
  end

  alias primary_address primary_postal_address

  def primary_postal_address=(postal_address)
    self.set_primary_contact(PostalAddress, postal_address)
  end

  alias primary_address= primary_postal_address=

  def set_primary_contact(contact_mechanism_class, contact_mechanism_instance)
    # set is_primary to false for any current primary contacts of this type
    primary_contact_mechanism = get_primary_contact(contact_mechanism_class)
    if primary_contact_mechanism
      primary_contact_mechanism.is_primary = false
      primary_contact_mechanism.save
    end

    contact_mechanism_instance.is_primary = true
    contact_mechanism_instance.save

    contact_mechanism_instance
  end

  def get_primary_contact(contact_mechanism_class)
    table_name = contact_mechanism_class.name.tableize

    self.contacts.joins("inner join #{table_name} on #{table_name}.id = contact_mechanism_id and contact_mechanism_type = '#{contact_mechanism_class.name}'")
    .where('contacts.is_primary = ?', true).readonly(false).first
  end

  def find_contact_mechanism_with_purpose(contact_mechanism_class, contact_purpose)
    contact = self.find_contact_with_purpose(contact_mechanism_class, contact_purpose)

    contact.contact_mechanism unless contact.nil?
  end

  def find_contact_with_purpose(contact_mechanism_class, contact_purpose)
    #if a symbol or string was passed get the model
    unless contact_purpose.is_a? ContactPurpose
      contact_purpose = ContactPurpose.find_by_internal_identifier(contact_purpose.to_s)
    end

    self.find_contact(contact_mechanism_class, nil, [contact_purpose])
  end

  def find_all_contacts_by_contact_mechanism(contact_mechanism_class)
    table_name = contact_mechanism_class.name.tableize

    contacts = self.contacts.joins("inner join #{table_name} on #{table_name}.id = contact_mechanism_id and contact_mechanism_type = '#{contact_mechanism_class.name}'")

    contacts.collect(&:contact_mechanism)
  end

  def find_contact(contact_mechanism_class, contact_mechanism_args={}, contact_purposes=[])
    table_name = contact_mechanism_class.name.tableize

    query = self.contacts.joins("inner join #{table_name} on #{table_name}.id = contact_mechanism_id and contact_mechanism_type = '#{contact_mechanism_class.name}'
                                   inner join contact_purposes_contacts on contact_purposes_contacts.contact_id = contacts.id
                                   and contact_purposes_contacts.contact_purpose_id in (#{contact_purposes.collect { |item| item.attributes["id"] }.join(',')})")

    contact_mechanism_args.each do |key, value|
      next if key == 'updated_at' or key == 'created_at' or key == 'id' or key == 'is_primary'
      query = query.where("#{table_name}.#{key} = ?", value) unless value.nil?
    end unless contact_mechanism_args.nil?

    query.first
  end

  # looks for contacts matching on value and purpose
  # if a contact exists, it updates, if not, it adds it
  def add_contact(contact_mechanism_class, contact_mechanism_args={}, contact_purposes=[])
    is_primary = contact_mechanism_args['is_primary']
    contact_purposes = [contact_purposes] if !contact_purposes.kind_of?(Array) # gracefully handle a single purpose not in an array

    contact_mechanism_args.delete_if { |k, v| ['created_at', 'updated_at', 'is_primary'].include? k.to_s }
    contact_mechanism = contact_mechanism_class.new(contact_mechanism_args)
    contact_mechanism.contact.party = self
    contact_mechanism.contact.contact_purposes = contact_purposes
    contact_mechanism.contact.save
    contact_mechanism.save

    set_primary_contact(contact_mechanism_class, contact_mechanism) if is_primary

    contact_mechanism
  end

  # tries to update contact by purpose
  # if contact doesn't exist, it adds it
  def update_or_add_contact_with_purpose(contact_mechanism_class, contact_purpose, contact_mechanism_args)
    contact_mechanism = update_contact_with_purpose(contact_mechanism_class, contact_purpose, contact_mechanism_args)

    unless contact_mechanism
      contact_mechanism = add_contact(contact_mechanism_class, contact_mechanism_args, [contact_purpose])
    end

    contact_mechanism
  end

  # looks for a contact matching on purpose
  # if it exists, it updates it, if not returns false
  def update_contact_with_purpose(contact_mechanism_class, contact_purpose, contact_mechanism_args)
    contact = find_contact_with_purpose(contact_mechanism_class, contact_purpose)
    contact.nil? ? false : update_contact(contact_mechanism_class, contact, contact_mechanism_args)
  end

  def update_contact(contact_mechanism_class, contact, contact_mechanism_args)
    set_primary_contact(contact_mechanism_class, contact.contact_mechanism) if contact_mechanism_args[:is_primary] == true

    contact_mechanism_class.update(contact.contact_mechanism, contact_mechanism_args)

    contact.contact_mechanism
  end

  def get_contact_by_method(m)
    method_name = m.split('_')
    return nil if method_name.size < 3 or method_name.size > 4
    # handles 1 or 2 segment contact purposes (i.e. home or employment_offer)
    # contact mechanism must be 2 segments, (i.e. email_address, postal_address, phone_number)
    if method_name.size == 4
      purpose = method_name[0] + '_' + method_name[1]
      klass = method_name[2] + '_' + method_name[3]
    else
      purpose = method_name[0]
      klass = method_name[1] + '_' + method_name[2]
    end

    #constantize klass to make sure it exists and is loaded
    begin
      klass_const = klass.camelize.constantize
      contact_purpose = ContactPurpose.find_by_internal_identifier(purpose)
      if contact_purpose.nil?
        return nil
      else
        find_contact_mechanism_with_purpose(klass_const, contact_purpose)
      end
    rescue NameError
      return nil
    end

  end

  def respond_to?(m, include_private_methods = false)
    (super ? true : get_contact_by_method(m.to_s)) rescue super
  end

  def method_missing(m, *args, &block)
    if self.respond_to?(m)
      value = get_contact_by_method(m.to_s)
      (value.nil?) ? super : (return value)
    else
      super
    end
  end

  #************************************************************************************************
  #** End
  #************************************************************************************************
end
