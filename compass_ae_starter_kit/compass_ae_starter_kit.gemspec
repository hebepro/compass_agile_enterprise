$:.push File.expand_path("../lib", __FILE__)

# Maintain your gem's version:
require "compass_ae_starter_kit/version"

# Describe your gem and declare its dependencies:
Gem::Specification.new do |s|
  s.platform    = Gem::Platform::RUBY
  s.name        = "compass_ae_starter_kit"
  s.version     = CompassAeStarterKit::VERSION::STRING
  s.licenses    = ['GPL-3-LICENSE']
  s.summary     = "Gem to help get the Compass AE framework up a running"
  s.description = "Contains compass_ae command to create a new Compass AE application"
  s.authors     = ["Rick Koloski, Russell Holmes"]
  s.email       = ["russonrails@gmail.com"]
  s.homepage    = "http://development.compassagile.com"

  s.license = 'GPL-3'
  s.files = Dir["{lib,config,public}/**/*"] + ["GPL-3-LICENSE", "README.md"]
  s.bindir      = 'bin'
  s.executables = ['compass_ae']

  s.add_dependency "rails", "~> 3.2"

  s.add_development_dependency "rspec-rails", "~> 2.12"
  s.add_development_dependency "simplecov", "~> 0.7"
  s.add_development_dependency "spork", "~> 0.9"
  s.add_development_dependency "sqlite3", "~> 1.3"
  s.add_development_dependency "watchr", "~> 0.7"
end
