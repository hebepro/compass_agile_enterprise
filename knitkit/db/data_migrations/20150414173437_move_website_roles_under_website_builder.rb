class MoveWebsiteRolesUnderWebsiteBuilder
  
  def self.up
    Website.all.each do |website|
      role = website.role

      role.move_to_child_of(SecurityRole.iid('website_builder'))
    end
  end
  
  def self.down
    Website.all.each do |website|
      role = website.role

      role.move_to_child_of(nil)
    end
  end

end
