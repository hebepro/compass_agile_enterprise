class AddPrecedenceToConfigurationItemTypes < ActiveRecord::Migration
  def change
    add_column :configuration_item_types, :precedence, :integer, :default => 0

    add_index :configuration_item_types, :precedence
  end
end
