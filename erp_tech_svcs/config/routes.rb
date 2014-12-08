Rails.application.routes.draw do
  #handle login / logout
  match "/session/sign_in" => 'erp_tech_svcs/session#create'
  match "/session/sign_out" => 'erp_tech_svcs/session#destroy'
  post "/session/keep_alive" => 'erp_tech_svcs/session#keep_alive'
  get "/session/is_alive" => 'erp_tech_svcs/session#is_alive'

  #handle activation
  get "/users/activate/:activation_token" => 'erp_tech_svcs/user#activate'
  post "/users/reset_password" => 'erp_tech_svcs/user#reset_password'
  post "/users/update_password" => 'erp_tech_svcs/user#update_password'
end
