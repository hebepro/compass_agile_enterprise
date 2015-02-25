class TimeSheetEntry < ActiveRecord::Base
  attr_protected :created_at, :updated_at

  has_many  :time_sheet_entry_party_roles

end
