module Api
  module V1
    class CategoriesController < BaseController

      def index
        parent_id = params[:parent_id]

        if parent_id
          parent = Category.find(parent_id)
          if parent
            categories = parent.children
          else
            categories = []
          end
        else
          categories = Category.roots
        end

        render json: {categories: categories.collect(&:to_data_hash)}
      end

      def show
        category = Category.find(params[:id])

        render json: {category: category.to_data_hash}
      end

      def create
        parent_id = params[:parent_id]

        begin
          ActiveRecord::Base.transaction do
            category = Category.new(
                description: params[:description].strip,
                internal_identifier: params[:internal_identifier].strip

            )
            category.save!

            if parent_id
              parent = Category.find(parent_id)
              if parent
                category.move_to_child_of(parent)
              end
            end

            render json: {success: true, category: category.to_data_hash}
          end
        rescue => ex
          Rails.logger.error ex.message
          Rails.logger.error ex.backtrace.join("\n")

          # email error
          ExceptionNotifier.notify_exception(ex) if defined? ExceptionNotifier

          render json: {success: false, message: 'Application Error'}
        end
      end

      def update
        category = Category.find(params[:id])

        begin
          ActiveRecord::Base.transaction do
            category.description = params[:description].strip
            category.internal_identifier = params[:internal_identifier].strip
            category.save!

            render json: {success: true, category: category.to_data_hash}
          end
        rescue => ex
          Rails.logger.error ex.message
          Rails.logger.error ex.backtrace.join("\n")

          # email error
          ExceptionNotifier.notify_exception(ex) if defined? ExceptionNotifier

          render json: {success: false, message: 'Application Error'}
        end
      end

      def destroy
        category = Category.find(params[:id])

        category.destroy

        render json: {success: true}
      end

    end # CategoriesController
  end # V1
end # Api