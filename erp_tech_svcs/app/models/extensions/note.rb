Note.class_eval do
  def created_by_username
    created_by.user.username rescue ''
  end
end
