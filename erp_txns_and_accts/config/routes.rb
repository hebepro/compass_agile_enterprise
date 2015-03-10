Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :biz_txn_types
    end
  end

end

ErpTxnsAndAccts::Engine.routes.draw do
end
