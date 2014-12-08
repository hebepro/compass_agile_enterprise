#ErpApp

Provides an application infrastructure based on the Sencha/extjs UI framework, as well as several utilities and example applications. It houses the core application container framework and component model infrastructure that play a key role in the RAD/Agile orientation of CompassAE.

##Initializer Options

- session_warn_after
  - This is the time in minutes when the user will be warned that thier session is about to expire due to inactivity.
  - Default : 18
- session_redirect_after
  - This is the time in minutes a user will be redirected to the login screen. It should be set to mimic your Rails configuration
  - Default : 20

### Override Initializer

To override these settings simple create a erp_app.rb file in your initializers and override the config options you want

    Rails.application.config.erp_app.configure do |config|
      config.session_warn_after = 18 #in minutes
      config.session_redirect_after = 20 #in minutes
    end
    Rails.application.config.erp_app.configure!
