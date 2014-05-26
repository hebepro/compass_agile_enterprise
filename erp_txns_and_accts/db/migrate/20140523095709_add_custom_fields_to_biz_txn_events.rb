class AddCustomFieldsToBizTxnEvents < ActiveRecord::Migration
  def change
    add_column :biz_txn_events, :custom_fields, :text
  end
end
