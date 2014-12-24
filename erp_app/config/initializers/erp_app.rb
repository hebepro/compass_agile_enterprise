Rails.application.config.erp_app.configure do |config|
  config.session_warn_after = 18 # in minutes
  config.session_redirect_after = 20 # in minutes
  config.max_js_loader_order_index = 9999 # max loader order index for a js file
end
Rails.application.config.erp_app.configure!
