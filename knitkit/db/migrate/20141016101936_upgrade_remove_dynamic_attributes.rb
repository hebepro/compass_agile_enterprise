# This migration is for removing dynamic attributes column from documents table.
class UpgradeRemoveDynamicAttributes < ActiveRecord::Migration
  def up
    if table_exists?(:documents)
      if column_exists?(:documents, :dynamic_attributes)
        remove_column :documents, :dynamic_attributes
      end
    end
  end

  def down
  end
end
