require 'json'
package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

Pod::Spec.new do |s|
  s.name           = 'RestActivity'
  s.version        = package['version']
  s.summary        = 'Live Activity (ActivityKit) bridge for the rest timer'
  s.description    = 'Starts, updates and ends the rest-timer Live Activity.'
  s.author         = ''
  s.homepage       = 'https://github.com/lukasz/trening'
  s.platforms      = { :ios => '15.1' }
  s.source         = { git: '' }
  s.static_framework = true
  s.swift_version  = '5.9'
  # ActivityKit istnieje od iOS 16.1 — słabe linkowanie, żeby apka startowała na iOS 15 (moduł i tak sprawdza #available).
  s.weak_frameworks = 'ActivityKit'
  s.dependency 'ExpoModulesCore'
  s.pod_target_xcconfig = { 'DEFINES_MODULE' => 'YES', 'SWIFT_COMPILATION_MODE' => 'wholemodule' }
  s.source_files = "ios/**/*.{h,m,mm,swift,hpp,cpp}"
end
