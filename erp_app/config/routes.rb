Rails.application.routes.draw do
  match '/download/:filename' => 'erp_app/public#download', :filename => /[^\/]*/
end

ErpApp::Engine.routes.draw do
  
  ##########################
  #ErpApp general routes
  ##########################
  match '/application/:action' => "application"
  match '/login(/:application)' => "login#index"
  match '/public/:action' => "public"

  #############################
  #Shared Application Routes
  #############################
  get '/shared/notes(/:action)' => "shared/notes"
  post '/shared/notes' => "shared/notes#create"
  delete '/shared/notes/:id' => "shared/notes#destroy"
  match '/shared/audit_log/:action' => 'shared/audit_log'

  #############################
  #Mobile Application Routes
  #############################
  match '/mobile' => 'mobile/base#index'
  match '/mobile/login' => 'mobile/login#index'

  #Mobile Applications
  #user_management
  match '/mobile/user_management(/:action)' => "mobile/user_management/base"

  #############################
  #Organizer Application Routes
  #############################

  namespace :organizer do
    match '(/:action)' => "base"

    match '/application_management/:action(/:id)' => "application_management"

    namespace :crm do

      resources :parties do
        collection do
          get 'search'
        end

        member do
          get 'details'
        end
      end

      resources :contact_mechanisms do
        collection do
          get 'states'
        end

        member do
          post 'send_email'
        end
      end

      resources :users

      match '/relationship(/:action(/:id))' => "relationship"
    end

  end

  match '/admin' => "login#index", :defaults => { :application => "desktop" }

  ############################
  #Desktop Application Routes
  ############################
  namespace :desktop do
    match '/' => "base#index"

    #Desktop Applications

    #scaffold
    match 'scaffold/:action((/:model_name)(/:id))' => "scaffold/base"

    #user_management
    match 'user_management/users(/:action(/:id))' => "user_management/base"
    match 'user_management/role_management/:action' => "user_management/role_management"
    match 'user_management/application_management/:action' => "user_management/application_management"

    #security_management
    match 'security_management/groups(/:action(/:assign_to(/:id)))' => "security_management/groups"
    match 'security_management/users(/:action(/:assign_to(/:id)))' => "security_management/users"
    match 'security_management/roles(/:action(/:assign_to(/:id)))' => "security_management/roles"
    match 'security_management/capabilities(/:action(/:assign_to(/:id)))' => "security_management/capabilities"
    match 'security_management/(/:action)' => "security_management/base"

    #control_panel
    match 'control_panel/application_management/:action(/:id)' => "control_panel/application_management"
    match 'control_panel/desktop_management/:action' => "control_panel/desktop_management"

    #file_manager
    match 'file_manager/base/:action' => "file_manager/base"
    match 'file_manager/download_file/:path' => "file_manager/base#download_file"

    #configuration_management
    match 'configuration_management/:action' => "configuration_management/base"
    match 'configuration_management/types/:action' => "configuration_management/types"
    match 'configuration_management/options/:action' => "configuration_management/options"

    #tail
    match 'tail(/:action)' => "tail/base"

    #job_tracker
    match 'job_tracker(/:action)' => "job_tracker/base"
  end

  #widget proxy
  match '/widgets/:widget_name/:widget_action/:uuid(/:id)' => "widget_proxy#index", :as => :widget

  #shared
  match '/shared/configuration/(/:action(/:id(/:category_id)))' => "shared/configuration"
  match '/shared/profile_management/:action' => "shared/profile_management"

end