ErpWorkEffort::Engine.routes.draw do

  namespace :erp_app do
    namespace :organizer do
      namespace :tasks do

        resources :work_efforts

      end
    end
  end

end
