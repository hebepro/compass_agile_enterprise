class PasswordStrengthValidator < ActiveModel::EachValidator
  # implement the method where the validation logic must reside
  def validate_each(record, attribute, value)
    password_validation_hash = record.password_validator || {:error_message => 'must be between 8 and 20 characters with no spaces', :regex => '^\S{8,20}$'}
    record.errors[attribute] << password_validation_hash[:error_message] unless Regexp.new(password_validation_hash[:regex]) =~ value
  end
end
        
