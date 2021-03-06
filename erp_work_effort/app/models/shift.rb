class Shift < ActiveRecord::Base
  attr_protected :created_at, :updated_at

  is_json :custom_fields


  # override getter to format time
  def shift_start
    read_attribute(:shift_start).strftime('%I:%M%p')
  end

  # override getter to format time
  def shift_end
    read_attribute(:shift_end).strftime('%I:%M%p')
  end

  def shift_label
    read_attribute(:description) + '  ' + self.shift_start + '-' + self.shift_end
  end

end
