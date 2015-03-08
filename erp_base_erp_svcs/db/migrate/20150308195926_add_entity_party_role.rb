class AddEntityPartyRole < ActiveRecord::Migration
  def up
    create_table :entity_party_roles do |t|
      t.references :party
      t.references :role_type
      t.references :entity_record, :polymorphic => true
    end

    add_index :entity_party_roles, :party_id
    add_index :entity_party_roles, :role_type_id
    add_index :entity_party_roles, [:entity_record_id, :entity_record_type], name: 'entity_party_roles_entity_record_idx'
  end

  def down
    drop_table :entity_party_roles
  end
end
