class AddWebsiteMemberRoles
  
  def self.up
    website_role_type_parent = RoleType.find_or_create('website', 'Website')
    RoleType.find_or_create('member', 'Member', website_role_type_parent)
  end
  
  def self.down
    RoleType.iid('website').destroy_all
  end

end
