$:.push File.expand_path("../lib", __FILE__)

# Maintain your gem's version:
require "erp_work_effort/version"

# Describe your gem and declare its dependencies:
Gem::Specification.new do |s|
  s.platform    = Gem::Platform::RUBY
  s.name        = "erp_work_effort"
  s.version     = ErpWorkEffort::VERSION::STRING
  s.licenses    = ['GPL-3-LICENSE']
  s.summary     = "Summary of ErpWorkEffort."
  s.description = "Description of ErpWorkEffort."
  s.authors     = ["Rick Koloski, Russell Holmes"]
  s.email       = ["russonrails@gmail.com"]
  s.homepage    = "http://development.compassagile.com"

  s.files = Dir["{app,config,db,lib,tasks}/**/*"] + ["GPL-3-LICENSE", "Rakefile", "README.rdoc"]
  s.test_files = Dir["spec/**/*"]

  #compass dependencies
  s.add_dependency "erp_tech_svcs", "~> 4.0"
  s.add_dependency "erp_inventory", "~> 4.0"
  s.add_development_dependency "erp_dev_svcs", "~> 4.0"
end
