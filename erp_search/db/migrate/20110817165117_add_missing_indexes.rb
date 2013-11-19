class AddMissingIndexes < ActiveRecord::Migration
  def up
    add_index :party_search_facts, :party_id, :name => 'party_search_facts_party_id_idx'
  end

  def down
    remove_index :party_search_facts, :party_id
  end
end
