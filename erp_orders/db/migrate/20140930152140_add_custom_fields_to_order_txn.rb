class AddCustomFieldsToOrderTxn < ActiveRecord::Migration
  def change
    if ::ActiveRecord::Base.connection.instance_values["config"][:adapter] == 'postgresql'
      execute('CREATE EXTENSION IF NOT EXISTS hstore;')

      add_column :order_txns, :custom_fields, :hstore
      add_hstore_index :order_txns, :custom_fields
    else
      add_column :order_txns, :custom_fields, :text
    end
  end
end
