class NestKnitkitSecurityRoles
  
  def self.up
    website_author = SecurityRole.find_by_internal_identifier('website_author')
    layout_author = SecurityRole.find_by_internal_identifier('layout_author')
    content_author = SecurityRole.find_by_internal_identifier('content_author')
    designer = SecurityRole.find_by_internal_identifier('designer')
    publisher = SecurityRole.find_by_internal_identifier('publisher')

    website_builder = SecurityRole.create(:internal_identifier => 'website_builder', :description => 'Website Builder')

    website_author.move_to_child_of(website_builder)
    layout_author.move_to_child_of(website_builder)
    content_author.move_to_child_of(website_builder)
    designer.move_to_child_of(website_builder)
    publisher.move_to_child_of(website_builder)
  end
  
  def self.down
    website_author = SecurityRole.find_by_internal_identifier('website_author')
    layout_author = SecurityRole.find_by_internal_identifier('layout_author')
    content_author = SecurityRole.find_by_internal_identifier('content_author')
    designer = SecurityRole.find_by_internal_identifier('designer')
    publisher = SecurityRole.find_by_internal_identifier('publisher')

    website_author.move_to_child_of(nil)
    layout_author.move_to_child_of(nil)
    content_author.move_to_child_of(nil)
    designer.move_to_child_of(nil)
    publisher.move_to_child_of(nil)

    SecurityRole.find_by_internal_identifier('website_builder').destroy
  end

end
