class AddTypeSemanticsToUom < ActiveRecord::Migration
  def up

    #Nested set fields
    unless columns(:unit_of_measurements).collect {|c| c.name}.include?('lft')
      add_column :unit_of_measurements, :lft, :integer
    end
    unless columns(:unit_of_measurements).collect {|c| c.name}.include?('rgt')
      add_column :unit_of_measurements, :rgt, :integer
    end
    unless columns(:unit_of_measurements).collect {|c| c.name}.include?('parent_id')
      add_column :unit_of_measurements, :parent_id, :integer
    end
    unless columns(:unit_of_measurements).collect {|c| c.name}.include?('internal_identifier')
      add_column :unit_of_measurements, :internal_identifier, :string
    end
    unless columns(:unit_of_measurements).collect {|c| c.name}.include?('comments')
      add_column :unit_of_measurements, :comments, :text
    end

    #External Identifier fields
    unless columns(:unit_of_measurements).collect {|c| c.name}.include?('external_identifier')
      add_column :unit_of_measurements, :external_identifier, :string
    end
    unless columns(:unit_of_measurements).collect {|c| c.name}.include?('external_id_source')
      add_column :unit_of_measurements, :external_id_source, :string
    end

  end

  def down
    if columns(:unit_of_measurements).collect {|c| c.name}.include?('lft')
      remove_column :unit_of_measurements, :lft
    end
    if columns(:unit_of_measurements).collect {|c| c.name}.include?('rgt')
      remove_column :unit_of_measurements, :rgt
    end
    if columns(:unit_of_measurements).collect {|c| c.name}.include?('parent_id')
      remove_column :unit_of_measurements, :rgt
    end
    if columns(:unit_of_measurements).collect {|c| c.name}.include?('internal_identifier')
      remove_column :unit_of_measurements, :rgt
    end
    if columns(:unit_of_measurements).collect {|c| c.name}.include?('comments')
      remove_column :unit_of_measurements, :rgt
    end
    if columns(:unit_of_measurements).collect {|c| c.name}.include?('external_identifier')
      remove_column :unit_of_measurements, :rgt
    end
    if columns(:unit_of_measurements).collect {|c| c.name}.include?('external_id_source')
      remove_column :unit_of_measurements, :rgt
    end
  end
end
