Rails.application.routes.draw do
  filter :section_router
  
  get 'knitkit_mobile' => 'knitkit/mobile#index'
  match 'pages/:section_id' => 'knitkit/website_sections#index', :as => 'page'
  get 'onlinedocumentsections/:section_id' => 'knitkit/online_document_sections#index', :as => 'document'
  #get 'onlinedocumentsections/:section_id/:id' => 'knitkit/online_document_sections#show', :as => 'document'
  get 'blogs/:section_id(.:format)' => 'knitkit/blogs#index', :as => 'blogs'
  get 'blogs/:section_id/:id' => 'knitkit/blogs#show', :as => 'blog_article'
  get 'blogs/:section_id/tag/:tag_id(.:format)' => 'knitkit/blogs#tag', :as => 'blog_tag'
  
  match '/comments/add' => 'knitkit/comments#add', :as => 'comments'
  match '/unauthorized' => 'knitkit/unauthorized#index', :as => 'knitkit/unauthorized'
  match '/view_current_publication' => 'knitkit/base#view_current_publication'
  match '/online_document_sections(/:action)' => 'knitkit/online_document_sections'
end

Knitkit::Engine.routes.draw do
  #Desktop Applications
  #knitkit
  namespace :erp_app do
    namespace :desktop do
      match '/:action' => 'app'
      match '/image_assets/:context/:action' => 'image_assets'
      match '/file_assets/:context/:action' => 'file_assets'
      #articl
      match '/articles/:action(/:section_id)' => 'articles'
      #conten
      match '/content/:action' => 'content'
      #websit
      match '/site(/:action)' => 'website'
      #sectio
      match '/section/:action' => 'website_section'
      #docume
      match '/online_document_sections/:action' => 'online_document_sections'
      #theme
      match '/theme/:action' => 'theme'
      #versio
      match '/versions/:action' => 'versions'
      #commen
      match '/comments/:action(/:content_id)' => 'comments'
      #inquir
      match '/inquiries/:action(/:website_id)' => 'inquiries'
      #websit
      match '/website_nav/:action' => 'website_nav'
      #positi
      match '/position/:action' => 'position'
    end
  end
end
