class AddErpBaseErpSvcsMissingIndexes < ActiveRecord::Migration
  def up
    if indexes(:relationship_types).select { |index| index.name == 'relationship_types_parent_id_idx' }.empty?
      add_index :relationship_types, :parent_id, :name => 'relationship_types_parent_id_idx'
      add_index :relationship_types, :internal_identifier, :name => 'relationship_types_internal_identifier_idx'
      add_index :contact_types, :internal_identifier, :name => 'contact_types_internal_identifier_idx'
      add_index :contact_purposes, :internal_identifier, :name => 'contact_purposes_internal_identifier_idx'
      add_index :categories, :internal_identifier, :name => 'categories_internal_identifier_idx'
      add_index :categories, :parent_id, :name => 'categories_parent_id_idx'
      add_index :category_classifications, :category_id, :name => 'category_classifications_category_id_idx'
      add_index :descriptive_assets, :internal_identifier, :name => 'descriptive_assets_internal_identifier_idx'
      add_index :view_types, :internal_identifier, :name => 'view_types_internal_identifier_idx'
      add_index :note_types, :parent_id, :name => 'note_types_parent_id_idx'
      add_index :note_types, :internal_identifier, :name => 'note_types_internal_identifier_idx'
    end
  end

  def down
    unless indexes(:relationship_types).select { |index| index.name == 'relationship_types_parent_id_idx' }.empty?
      remove_index :relationship_types, :parent_id
      remove_index :relationship_types, :internal_identifier
      remove_index :contact_types, :internal_identifier
      remove_index :contact_purposes, :internal_identifier
      remove_index :categories, :internal_identifier
      remove_index :categories, :parent_id
      remove_index :category_classifications, :category_id
      remove_index :descriptive_assets, :internal_identifier
      remove_index :view_types, :internal_identifier
      remove_index :note_types, :parent_id
      remove_index :note_types, :internal_identifier
    end
  end
end
