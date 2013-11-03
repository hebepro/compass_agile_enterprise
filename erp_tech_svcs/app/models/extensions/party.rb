Party.class_eval do
  has_security_roles
  has_many :users, :dependent => :destroy

  # Helper method as most parties will have only one user
  def user
    users.first
  end
end
