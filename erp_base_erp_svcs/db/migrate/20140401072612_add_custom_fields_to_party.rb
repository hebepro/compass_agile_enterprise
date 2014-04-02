class AddCustomFieldsToParty < ActiveRecord::Migration
  def change
    add_column :parties, :custom_fields, :text
  end
end
