class AddPublishingToWebsite < ActiveRecord::Migration
  def change
    add_column :websites, :publishing, :boolean, :default => false
  end
end
