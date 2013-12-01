module ErpTechSvcs
  module Extensions
    module ActiveRecord
      module HasUserDefinedData

        module Errors
          class UserDefinedFieldAlreadyExists < StandardError
            def to_s
              "User defined field already exists."
            end
          end

          class UserDefinedFieldDoesNotExist < StandardError
            def to_s
              "User defined field does not exist."
            end
          end

          class UserDefinedDataDoesNotExist < StandardError
            def to_s
              "User defined data does not exist."
            end
          end
        end

        def self.included(base)
          base.extend(ClassMethods)
        end

        module ClassMethods

          def has_user_defined_data
            extend HasUserDefinedData::SingletonMethods
            include HasUserDefinedData::InstanceMethods
          end

        end

        module SingletonMethods

          def remove_all_user_defined_data
            UserDefinedData.destroy_all("model_name = #{self.name}")
          end

          alias remove_user_fields remove_all_user_defined_data

          def user_defined_fields(scope=nil)
            user_defined_data = if scope
                                  # return array and remove nil if none with specified scope
                                  [UserDefinedData.where('scope = ? and model_name = ?', scope, self.name).first].compact
                                else
                                  UserDefinedData.where('model_name = ?', self.name).all
                                end

            if user_defined_data.empty?
              []
            else
              user_defined_data.collect(&:user_defined_fields).flatten
            end

          end

          alias user_fields user_defined_fields

          def user_defined_field(field_name, scope=nil)
            UserDefinedField.joins(:user_defined_data)
            .where('model_name = ?', self.name)
            .where('scope = ?', scope)
            .where('field_name = ?', field_name).first
          end

          alias user_field user_defined_field

          def add_user_defined_field(field_name, label, data_type, scope=nil)
            current_user_field = self.user_field(field_name, scope)

            if current_user_field
              raise Error::UserDefinedFieldAlreadyExists
            else
              user_defined_field = UserDefinedField.new(field_name: field_name, label: label, data_type: data_type)

              user_defined_data = if scope
                                    # return array and remove nil if none with specified scope
                                    UserDefinedData.where('scope = ? and model_name = ?', scope, self.name).first
                                  else
                                    UserDefinedData.where('scope = ? and model_name = ?', nil, self.name)
                                  end

              user_defined_data = UserDefinedData.new(scope: scope, model_name: self.name) unless user_defined_data

              user_defined_data.user_defined_fields << user_defined_field
              user_defined_data.save

              user_defined_field
            end

          end

          alias add_user_field add_user_defined_field

          def update_user_defined_field(field_name, label, scope=nil)
            current_user_field = self.user_field(field_name, scope)

            if current_user_field
              current_user_field.label = label
              current_user_field.save
            else
              raise Errors::UserDefinedFieldDoesNotExist
            end
          end

          alias update_user_field update_user_defined_field

          def remove_user_defined_field(field_name, scope=nil)
            user_defined_data = if scope
                                  # return array and remove nil if none with specified scope
                                  UserDefinedData.where('scope = ? and model_name = ?', scope, self.name).first
                                else
                                  UserDefinedData.where('scope = ? and model_name = ?', nil, self.name)
                                end

            if user_defined_data
              user_defined_field = user_defined_data.user_defined_fields.where('field_name = ?', field_name)

              if user_defined_field
                user_defined_field.destroy
              else
                raise Errors::UserDefinedFieldDoesNotExist
              end
            else
              raise Errors::UserDefinedDataDoesNotExist
            end
          end

          alias remove_user_field remove_user_defined_field

        end

        module InstanceMethods

        end

      end #HasUserDefinedData
    end #ActiveRecord
  end #Extensions
end #ErpTechSvcs

