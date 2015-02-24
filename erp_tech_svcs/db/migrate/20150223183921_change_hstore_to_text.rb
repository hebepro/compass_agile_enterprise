class ChangeHstoreToText < ActiveRecord::Migration
  def up
    if ::ActiveRecord::Base.connection.instance_values["config"][:adapter] == 'postgresql'

      # get all tables that have an hstore
      table_columns = ActiveRecord::Base.connection.tables.collect do |table|
        _columns = columns(table) rescue []

        if Object.class_exists?(table.classify)

          if _columns.collect(&:type).include?(:hstore) or _columns.collect(&:type).include?(:text)
            model = table.classify.constantize

            attributes = model.serialized_attributes.keys

            if attributes.length > 0
              {
                  table: table,
                  columns: attributes
              }
            end
          end

        else
          nil
        end
      end

      table_columns.compact!

      # remove any tables

      table_columns.each do |table_column|
        model = table_column[:table].classify.constantize

        # update serialize attribute to JSON
        table_column[:columns].each do |column|
          model.class_eval do
            serialize column, ::ActiveRecord::Coders::NestedHstore
          end
        end

        # get current data for table
        data = []

        model.all.each do |record|
          hash = {
              id: record.id
          }

          table_column[:columns].each do |column|
            hash[column.to_sym] = record.send(column.to_sym)
          end

          data.push(hash)
        end

        # drop and add column as json
        table_column[:columns].each do |column|
          remove_column table_column[:table], column
          add_column table_column[:table], column, :text
        end

        # update serialize attribute to JSON
        table_column[:columns].each do |column|
          model.class_eval do
            serialize column, JSON
          end
        end

        # move data back
        data.each do |data_hash|
          record = model.find(data_hash[:id])

          data_hash.delete(:id)

          data_hash.each do |key, value|
            record.send("#{key}=", value)
            record.save
          end

        end
      end

    end

  end

  def down
  end
end
