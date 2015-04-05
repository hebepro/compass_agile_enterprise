Rails.application.routes.draw do

  namespace :api do
    namespace :v1 do
      resources :parties
      resources :role_types
      resources :categories
    end
  end

end

ErpBaseErpSvcs::Engine.routes.draw do

  namespace 'shared' do
    resources 'units_of_measurement'
  end

end
