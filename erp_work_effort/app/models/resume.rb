class Resume < ActiveRecord::Base

	attr_protected :created_at,:updated_at

  belongs_to :party

  has_file_assets

  has_tracked_status

  def parse(cv_document)
  	file_support = ErpTechSvcs::FileSupport::Base.new(:storage => ErpTechSvcs::Config.file_storage)
    file_name = File.join(file_support.root, 'file_assets', cv_document)
  	wsdl='http://java.rchilli.com/RChilliParser/services/RChilliParser?wsdl'

  	if (File.exists?(file_name))
			resume_file_data = File.read(file_name)
			resume_file_base_64 = Base64.encode64(resume_file_data)
	    client = Savon.client(wsdl: wsdl)
	    xml = client.call(:parse_resume_binary, message: {filedata: resume_file_base_64, fileName: cv_document, userkey: "AJ9G8GRWZD3", version: "5.0.1", subUserId: "northcountry"})
	    self.file_content = resume_file_base_64
	    self.xml_resume_data = xml.body[:parse_resume_binary_response][:return]
	    self.add_file(resume_file_data, name)
	    self.save
      self.current_status = TrackedStatusType.find_by_ancestor_iids(['resume_parser', 'pending'])
	  else
	  	puts("file #{File.basename(file_name)} does'nt exists under 'file_assets'")
	  	false
	  end
  end

  def populate_model_data
  	doc = Nokogiri.XML(self.xml_resume_data)
  	doc_root = doc.root

  	# create Individual
  	individual = Individual.new
  	individual.current_first_name = doc_root.at_xpath("FirstName").text
  	individual.current_middle_name = doc_root.at_xpath("Middlename").text
  	individual.current_last_name = doc_root.at_xpath("LastName").text
  	individual.gender = doc_root.at_xpath("Gender").text
  	individual.birth_date = Date.parse(doc_root.at_xpath("DateOfBirth").text) if doc_root.at_xpath("DateOfBirth").text.present?
  	individual.marital_status = doc_root.at_xpath("MaritalStatus").text[0].upcase if doc_root.at_xpath("MaritalStatus").text.present?
  	individual.current_passport_number = doc_root.at_xpath("PassportNo").text
  	individual.total_years_work_experience = doc_root.at_xpath("WorkedPeriod").at_xpath("TotalExperienceInYear").text.to_i
    individual.save

  	party = individual.party
  	self.party = party
  	party.resumes << self

  	#create Contacts

  	if doc_root.at_xpath("Email").text.present?
	  	email = EmailAddress.create(email_address: doc_root.at_xpath("Email").text)
	  	party.contacts << email.contact
	  	email.contact.contact_purposes << ContactPurpose.iid("default")
	  end

  	phone_numbers = doc_root.at_xpath("Phone").text.split(",")
  	phone_numbers.each do |phone_number|
  		phone = PhoneNumber.create(phone_number: phone_number)
  		party.contacts << phone.contact
  		if phone_numbers.size == 1
  			phone.contact.contact_purposes << ContactPurpose.iid("default")
  		end
  	end

  	if doc_root.at_xpath("FaxNo").text.present?
  		fax = PhoneNumber.create(phone_number: doc_root.at_xpath("FaxNo").text)
  		party.contacts << fax.contact
  		fax.contact.contact_purposes << ContactPurpose.iid("fax")
  	end

  	if (doc_root.at_xpath("Address").text.present? || doc_root.at_xpath("City").text.present?)
	  	postal_address = PostalAddress.new
	  	postal_address.address_line_1 = doc_root.at_xpath("Address").text
	  	postal_address.city = doc_root.at_xpath("City").text
	  	postal_address.state = doc_root.at_xpath("State").text
	  	postal_address.country = doc_root.at_xpath("Country").text
	  	postal_address.zip = doc_root.at_xpath("ZipCode").text
	  	postal_address.save
	  	party.contacts << postal_address.contact
	  	postal_address.contact.contact_purposes << ContactPurpose.iid("default")
	  end

	  if (doc_root.at_xpath("PermanentAddress").text.present? || doc_root.at_xpath("PermanentCity").text.present?)
	  	postal_address = PostalAddress.new
	  	postal_address.address_line_1 = doc_root.at_xpath("PermanentAddress").text
	  	postal_address.city = doc_root.at_xpath("PermanentCity").text
	  	postal_address.state = doc_root.at_xpath("PermanentState").text
	  	postal_address.country = doc_root.at_xpath("PermanentCountry").text
	  	postal_address.zip = doc_root.at_xpath("PermanentZipCode").text
	  	postal_address.save
	  	party.contacts << postal_address.contact
	  	postal_address.contact.contact_purposes << ContactPurpose.iid("home")
	  end

  	#create party skills

  	skills = doc_root.at_xpath("Skills").text.split(",")
  	skills.each do |skill|
  		skill_type = SkillType.create(description: skill.strip)
  		party_skill = PartySkill.create(party_id: party.id , skill_type_id: skill_type.id)
  	end

  	# create position fulfillments

  	doc_root.at_xpath("SegregatedExperience").children.each do |child|
  		position_type = PositionType.new
  		position_type.description = child.at_xpath("JobProfile").text
  		position_type.title = child.at_xpath("JobProfile").text

  		position = Position.new
  		position.actual_from_date = Date.parse(child.at_xpath("StartDate").text) if child.at_xpath("StartDate").text.present?
  		position.actual_thru_date = Date.parse(child.at_xpath("EndDate").text) if child.at_xpath("EndDate").text.present?
  		position.party = party
  		position.position_type = position_type

  		position_fulfillment = PositionFulfillment.new
  		position_fulfillment.description = child.at_xpath("JobProfile").text
  		position_fulfillment.from_date = Date.parse(child.at_xpath("StartDate").text) if child.at_xpath("StartDate").text.present?
  		position_fulfillment.thru_date = Date.parse(child.at_xpath("EndDate").text) if child.at_xpath("EndDate").text.present?
  		position_fulfillment.held_by_party = party
  		position_fulfillment.position = position

  		[position_type, position, position_fulfillment].each do |entity|
  			entity.save
  		end

      self.current_status = TrackedStatusType.find_by_ancestor_iids(['resume_parser', 'complete'])

  	end
  end
end