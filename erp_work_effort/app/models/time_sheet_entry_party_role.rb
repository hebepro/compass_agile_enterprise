class TimeSheetEntryPartyRole < ActiveRecord::Base

  attr_protected :created_at, :updated_at

  belongs_to  :time_sheet_entry
  belongs_to  :party
  belongs_to  :role_type

end
