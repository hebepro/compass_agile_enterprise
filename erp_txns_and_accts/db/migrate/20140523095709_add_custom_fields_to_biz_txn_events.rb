class AddCustomFieldsToBizTxnEvents < ActiveRecord::Migration
  def change
    if ::ActiveRecord::Base.connection.instance_values["config"][:adapter] == 'postgresql'
      add_column :biz_txn_events, :custom_fields, :hstore
      add_hstore_index :biz_txn_events, :custom_fields
    else
      add_column :biz_txn_events, :custom_fields, :text
    end
  end
end
