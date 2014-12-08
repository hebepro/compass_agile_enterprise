$:.push File.expand_path("../lib", __FILE__)

# Maintain your gem's version:
require "erp_agreements/version"

# Describe your gem and declare its dependencies:
Gem::Specification.new do |s|
  s.platform    = Gem::Platform::RUBY
  s.name        = "erp_agreements"
  s.version     = ErpAgreements::VERSION::STRING
  s.licenses    = ['GPL-3-LICENSE']
  s.summary     = "The Agreements Engine implements model classes for storing Contracts and Agreements data, including AgreementItems, which represent the terms of the Agreement."
  s.description = "The Agreements Engine implements model classes for storing Contracts and Agreements data, including AgreementItems, which represent the terms of the Agreement. Contracts are a special case of Agreements, specifically Agreements which are legal in nature. Agreements and Terms are often used as the execution context of a rules engine to govern other behaviors of a system."
  s.authors     = ["Rick Koloski, Russell Holmes"]
  s.email       = ["russonrails@gmail.com"]
  s.homepage    = "http://development.compassagile.com"

  s.files = Dir["{app,config,db,lib,tasks}/**/*"] + ["GPL-3-LICENSE", "Rakefile", "README.rdoc"]
  s.test_files = Dir["spec/**/*"]

  #compass dependencies
  s.add_dependency "erp_tech_svcs", "~> 4.0"
  s.add_development_dependency "erp_dev_svcs", "~> 4.0"
end
