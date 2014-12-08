$:.push File.expand_path("../lib", __FILE__)

# Maintain your gem's version:
require "erp_products/version"

# Describe your gem and declare its dependencies:
Gem::Specification.new do |s|
  s.platform    = Gem::Platform::RUBY
  s.name        = "erp_products"
  s.version     = ErpProducts::VERSION::STRING
  s.licenses    = ['GPL-3-LICENSE']
  s.summary     = "The Products Engine implements ProductType and ProductInstance, as well as a number of classes to support product catalog-type functions and search/shopping scenarios."
  s.description = "The Products Engine implements ProductType and ProductInstance, as well as a number of classes to support product catalog-type functions and search/shopping scenarios. "
  s.authors     = ["Rick Koloski, Russell Holmes"]
  s.email       = ["russonrails@gmail.com"]
  s.homepage    = "http://development.compassagile.com"

  s.files = Dir["{app,config,db,lib,tasks}/**/*"] + ["GPL-3-LICENSE", "Rakefile", "README.rdoc"]
  s.test_files = Dir["spec/**/*"]

  #compass dependencies
  s.add_dependency "erp_app", "~> 4.0"
  s.add_development_dependency "erp_dev_svcs", "~> 4.0"
end
