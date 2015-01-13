class RemoveChargeLinePaymentTxn < ActiveRecord::Migration
  def up
    drop_table :charge_line_payment_txns
  end

  def down
    create_table :charge_line_payment_txns do |t|
      t.column :charge_line_id, :integer

      #polymorphic
      t.references :payment_txn, :polymorphic => true

      t.timestamps
    end

    add_index :charge_line_payment_txns, [:payment_txn_id, :payment_txn_type], :name => 'payment_txn_idx'
    add_index :charge_line_payment_txns, :charge_line_id
  end
end
