$:.push File.expand_path("../lib", __FILE__)

# Maintain your gem's version:
require "compass_ae_sencha/version"

Gem::Specification.new do |s|
  s.name        = "compass_ae_sencha"
  s.version     = CompassAeSencha::VERSION::STRING
  s.licenses    = ['GPL-3-LICENSE']
  s.platform    = Gem::Platform::RUBY
  s.authors     = ["Russell Holmes"]
  s.email       = ["rholmes@tnsolutionsinc.com"]
  s.homepage    = "http://tntech.biz"
  s.summary     = "Use Sencha with CompassAE"
  s.description = "This gem provides the Sencha library for CompassAE."
  s.license     = "GPL-3"

  s.files = Dir["{public,lib}/**/*"] + ["GPL-3-LICENSE", "Rakefile", "README.md"]
end
