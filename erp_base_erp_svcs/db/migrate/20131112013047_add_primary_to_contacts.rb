class AddPrimaryToContacts < ActiveRecord::Migration
  def up
    unless columns(:contacts).collect {|c| c.name}.include?('is_primary')
      add_column :contacts, :is_primary, :boolean 
    end
  end
  
  def down
    if columns(:contacts).collect {|c| c.name}.include?('is_primary')
      remove_column :contacts, :is_primary 
    end
  end
end
