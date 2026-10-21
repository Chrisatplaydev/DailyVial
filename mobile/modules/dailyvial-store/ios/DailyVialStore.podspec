Pod::Spec.new do |s|
  s.name = 'DailyVialStore'
  s.version = '1.0.0'
  s.summary = 'DailyVial verified StoreKit purchases'
  s.description = 'On-device Apple StoreKit 2 purchase verification for DailyVial Plus.'
  s.license = { :type => 'MIT' }
  s.author = 'DailyVial'
  s.homepage = 'https://github.com/Chrisatplaydev/DailyVial'
  s.platforms = { :ios => '15.1' }
  s.source = { :git => 'https://github.com/Chrisatplaydev/DailyVial.git' }
  s.static_framework = true
  s.dependency 'ExpoModulesCore'
  s.frameworks = 'StoreKit'
  s.swift_version = '5.9'
  s.source_files = '**/*.{h,m,mm,swift,hpp,cpp}'
end
