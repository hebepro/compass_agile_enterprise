class AddKnitkitMissingIndexes < ActiveRecord::Migration
  def up
    if indexes(:websites).select { |index| index.name == 'websites_internal_identifier_idx' }.empty?
      add_index :websites, :internal_identifier, :name => 'websites_internal_identifier_idx'
      add_index :website_section_versions, :website_id, :name => 'website_section_versions_website_id_idx'
      add_index :website_section_versions, :internal_identifier, :name => 'website_section_versions_internal_identifier_idx'
      add_index :content_versions, :created_by_id, :name => 'content_versions_created_by_id_idx'
      add_index :content_versions, :updated_by_id, :name => 'content_versions_updated_by_id_idx'
      add_index :content_versions, :internal_identifier, :name => 'content_versions_internal_identifier_idx'
      add_index :themes, :theme_id, :name => 'themes_theme_id_idx'
      add_index :documented_items, :documented_content_id, :name => 'documented_items_documented_content_id_idx'
      add_index :documented_items, :online_document_section_id, :name => 'documented_items_online_document_section_id_idx'
      add_index :documents, :internal_identifier, :name => 'documents_internal_identifier_idx'
      add_index :document_types, :internal_identifier, :name => 'document_types_internal_identifier_idx'
    end
  end

  def down
    unless indexes(:websites).select { |index| index.name == 'websites_internal_identifier_idx' }.empty?
      remove_index :websites, :internal_identifier
      remove_index :website_section_versions, :website_id
      remove_index :website_section_versions, :internal_identifier
      remove_index :content_versions, :created_by_id
      remove_index :content_versions, :updated_by_id
      remove_index :content_versions, :internal_identifier
      remove_index :themes, :theme_id
      remove_index :documented_items, :documented_content_id
      remove_index :documented_items, :online_document_section_id
      remove_index :documents, :internal_identifier
      remove_index :document_types, :internal_identifier
    end
  end
end
