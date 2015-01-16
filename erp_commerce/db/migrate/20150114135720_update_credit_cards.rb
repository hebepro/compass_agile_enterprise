class UpdateCreditCards < ActiveRecord::Migration
  def up
    remove_column :credit_cards, :credit_card_account_purpose_id
    remove_column :credit_cards, :first_name_on_card
    remove_column :credit_cards, :last_name_on_card

    add_column :credit_cards, :name_on_card, :string
    add_column :credit_cards, :crypted_private_cvc, :string

    add_column :credit_card_accounts, :credit_card_account_purpose_id, :integer
    add_index  :credit_card_accounts, :credit_card_account_purpose_id, :name => 'credit_card_acct_purpose_idx'

    add_index :credit_card_account_purposes, :parent_id
    add_index :credit_card_account_purposes, :lft
    add_index :credit_card_account_purposes, :rgt
  end

  def down
    add_column :credit_cards, :credit_card_account_purpose_id, :integer
    add_column :credit_cards, :first_name_on_card, :string
    add_column :credit_cards, :last_name_on_card, :string

    remove_column :credit_cards, :name_on_card
    remove_column :credit_cards, :crypted_private_cvc

    remove_column :credit_card_accounts, :credit_card_account_purpose_id

    remove_index :credit_card_account_purposes, :parent_id
    remove_index :credit_card_account_purposes, :lft
    remove_index :credit_card_account_purposes, :rgt
  end
end
