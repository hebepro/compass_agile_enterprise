class UpdateWebsiteInquiries < ActiveRecord::Migration
  def up

    add_column :website_inquiries, :first_name, :string
    add_column :website_inquiries, :last_name, :string
    add_column :website_inquiries, :email, :string
    add_column :website_inquiries, :message, :text
    add_column :website_inquiries, :created_by_id, :integer

    add_index :website_inquiries, :created_by_id, :name => 'inquiry_created_by_idx'
  end

  def down

    remove_column :website_inquiries, :first_name
    remove_column :website_inquiries, :last_name
    remove_column :website_inquiries, :email
    remove_column :website_inquiries, :message
    remove_column :website_inquiries, :created_by_id

  end
end
