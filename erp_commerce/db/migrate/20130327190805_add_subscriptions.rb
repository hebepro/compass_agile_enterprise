class AddSaasSubscriptions < ActiveRecord::Migration

  def self.up
    unless table_exists?(:subscriptions)
      create_table :subscriptions do |t|
        t.date :began_at
        t.date :ends_at
        t.date :trial_started_at
        t.date :trial_ends_at
        t.date :next_charge_date

        t.timestamps
      end

    end

    unless table_exists?(:subscription_accounts)
      create_table :subscription_accounts do |t|
        t.references :subscription

        t.timestamps
      end

      add_index :subscription_accounts, :subscription_id
    end
  end

  def self.down
    drop_table :subscriptions if table_exists?(:subscriptions)
    drop_table :subscription_accounts if table_exists?(:subscription_accounts)
  end

end
