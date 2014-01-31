ErpProducts::Engine.routes.draw do
  #product_manager
  match '/erp_app/desktop/product_manager(/:action(/:id))' => 'erp_app/desktop/product_manager/base'

  namespace 'shared' do
    resources 'product_types'
    get 'product_types/show_details(/:id)' => 'product_types#show_details'
  end
end