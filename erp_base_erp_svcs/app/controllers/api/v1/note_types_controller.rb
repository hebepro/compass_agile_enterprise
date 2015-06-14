module Api
  module V1
    class NoteTypesController < BaseController

      def index
        NoteType.include_root_in_json = false

        render json: {note_types: NoteType.all}
      end

    end # NoteTypesController
  end # V1
end # Api