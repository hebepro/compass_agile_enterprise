module ErpApp
  module Shared
    class NotesController < ErpApp::ApplicationController
      before_filter :require_login

      def view
        sort_hash = params[:sort].blank? ? {} : Hash.symbolize_keys(JSON.parse(params[:sort]).first)
        limit = params[:limit] || 30
        start = params[:start] || 0

        sort = sort_hash[:property] || 'created_at'
        dir = sort_hash[:direction] || 'DESC'

        statement = Note

        if params[:party_id] && params[:party_id] != "null"
          statement = Note.where('noted_record_id = ? and noted_record_type = ?', params[:party_id], 'Party')
        end

        total = statement.count('id')
        notes = statement.limit(limit).offset(start).order("#{sort} #{dir}")

        render :json => {totalCount: total, notes: notes.collect{|note| note.to_hash(only: [:id, :content, :created_at], methods: [:summary, :note_type_desc, :created_by_username])}}
      end

      def create
        content = params[:content]
        note_type = NoteType.find(params[:note_type_id])
        party = Party.find(params[:party_id])

        note = Note.create(
            :note_type => note_type,
            :content => content,
            :created_by_id => current_user.party.id
        )

        party.notes << note
        party.save

        render :json => {:success => true}
      end

      def delete
        Note.find(params[:id]).destroy ? (render :json => {:success => true}) : (render :json => {:success => false})
      end

      def note_types
        NoteType.include_root_in_json = false

        render :json => {:note_types => NoteType.all}
      end
    end
  end
end
