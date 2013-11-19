class AddErpAppMissingIndexes < ActiveRecord::Migration
  def up
    if indexes(:preference_types).select { |index| index.name == 'preference_types_internal_identifier_idx' }.empty?
      add_index :preference_types, :internal_identifier, :name => 'preference_types_internal_identifier_idx'
      add_index :preference_options, :internal_identifier, :name => 'preference_options_internal_identifier_idx'
      add_index :valid_preference_types, :preference_type_id, :name => 'valid_preference_types_preference_type_id_idx'
      add_index :valid_preference_types, :preferenced_record_id, :name => 'valid_preference_types_preferenced_record_id_idx'
      add_index :app_containers, :internal_identifier, :name => 'app_containers_internal_identifier_idx'
      add_index :widgets, :internal_identifier, :name => 'widgets_internal_identifier_idx'
      add_index :configurations, :internal_identifier, :name => 'configurations_internal_identifier_idx'
      add_index :configuration_item_types, :parent_id, :name => 'configuration_item_types_parent_id_idx'
      add_index :configuration_item_types, :internal_identifier, :name => 'configuration_item_types_internal_identifier_idx'
      add_index :applications, :internal_identifier, :name => 'applications_internal_identifier_idx'
    end
  end

  def down
    unless indexes(:preference_types).select { |index| index.name == 'preference_types_internal_identifier_idx' }.empty?
      remove_index :preference_types, :internal_identifier
      remove_index :preference_options, :internal_identifier
      remove_index :valid_preference_types, :preference_type_id
      remove_index :valid_preference_types, :preferenced_record_id
      remove_index :app_containers, :internal_identifier
      remove_index :widgets, :internal_identifier
      remove_index :configurations, :internal_identifier
      remove_index :configuration_item_types, :parent_id
      remove_index :configuration_item_types, :internal_identifier
      remove_index :applications, :internal_identifier
    end
  end
end
