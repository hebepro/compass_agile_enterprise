#  create_table :phone_numbers do |t|
#  	t.column :phone_number, :string
#  	t.column :description, :string
#
#  	t.timestamps
#  end

class PhoneNumber < ActiveRecord::Base
  attr_protected :created_at, :updated_at

  has_contact
  
	def summary_line
		"#{description} : #{phone_number}"
	end

  def eql_to?(phone)
    self.phone_number.reverse.gsub(/[^0-9]/,"")[0..9] == phone.reverse.gsub(/[^0-9]/,"")[0..9]
  end

	def to_label
		"#{description} : #{to_s}"
	end
	
	def to_s
	  "#{phone_number}"
	end

	def to_data_hash
		{
				phone_number: phone_number,
				description: description,
				created_at: created_at,
				updated_at: updated_at
		}
	end

end
