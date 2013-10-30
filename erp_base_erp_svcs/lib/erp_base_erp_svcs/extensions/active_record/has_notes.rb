module ErpBaseErpSvcs
	module Extensions
		module ActiveRecord
			module HasNotes
				def self.included(base)
				  base.extend(ClassMethods)
				end

				module ClassMethods
				  def has_notes

            has_many :notes, :as => :noted_record, :dependent => :delete_all do
              def by_type(note_type)
                find_by_note_type_id(note_type.id)
              end
            end
					
            extend SingletonMethods
            include InstanceMethods

				  end
				end

				module SingletonMethods
				end

				module InstanceMethods

          def create_or_update_note_by_type(note_type_iid='basic_note', content='', user=nil)
            note = note_by_type(note_type_iid)
            if note.nil?
              note = Note.new if note.nil?
              note.note_type_id = NoteType.find_by_internal_identifier(note_type_iid).id
              note.noted_record = self
              note.created_by_id = user.id unless user.nil?
            end
            note.content = content
            note.save
          end

          def note_by_type(note_type_iid)
            note_type = NoteType.find_by_internal_identifier(note_type_iid)
            notes.where(:note_type_id => note_type.id).first
          end

          def notes_by_type(note_type_iid)
            note_type = NoteType.find_by_internal_identifier(note_type_iid)
            notes.where(:note_type_id => note_type.id)
          end

				end
			end
		end
	end
end
