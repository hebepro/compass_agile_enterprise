class Organizer < AppContainer
  def setup_default_preferences

  end

  class << self
    def find_by_user(user)
      Organizer.where('user_id = ?', user.id).first
    end
  end
end
