class UpdateKnitkitSimplePassword
  
  def self.up
    option = ConfigurationOption.find_by_internal_identifier('simple_password_regex')
    if option
      option.value = '^\S{8,20}$'
      option.comment = 'must be between 8 and 20 characters with no spaces'
      option.save
    end
  end
  
  def self.down
    option = ConfigurationOption.find_by_internal_identifier('simple_password_regex')
    if option
      option.value = '^[A-Za-z]\w{6,}[A-Za-z]$'
      option.comment = 'must be at least 8 characters long and start and end with a letter'
      option.save
    end
  end

end
