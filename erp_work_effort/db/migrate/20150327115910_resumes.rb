# This migration comes from erp_work_effort (originally 20150327115704)
class Resumes < ActiveRecord::Migration
  def up
  	create_table :resumes do |t|
      t.references :party
  		t.column :file_content ,:text
  		t.column :xml_response ,:text
  	end
  end

  def down
    drop_table :resumes
  end

end