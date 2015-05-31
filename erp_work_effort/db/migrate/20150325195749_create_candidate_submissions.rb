class CreateCandidateSubmissions < ActiveRecord::Migration


  def self.up
    unless table_exists?(:candidate_submissions)
      create_table :candidate_submissions do |t|
        t.integer :order_line_item_id
        t.string  :description
        t.string  :internal_identifier
        t.text    :custom_fields
        t.timestamps
      end
    end
  end

  def self.down
    if table_exists?(:candidate_submissions)
      drop_table :candidate_submissions
    end
  end

end
