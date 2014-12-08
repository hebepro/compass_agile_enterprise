class AddCustomFieldsToCommEvt < ActiveRecord::Migration
  def change
    add_column :communication_events, :custom_fields, :text
  end
end
