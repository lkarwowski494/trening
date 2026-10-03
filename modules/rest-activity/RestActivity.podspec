require 'json'
package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

Pod::Spec.new do |s|
  s.name           = 'RestActivity'
  s.version        = package['version']
  s.summary        = 'Live Activity (ActivityKit) bridge for the rest timer'
  s.description    = 'Starts, updates and ends the rest-timer Live Activity.'
  s.author         = ''
  s.homepage       = 'https://github.com/lkarwowski494/trening'
  s.platforms      = { :ios => '16.4' } # SDK 56+: minimum iOS 16.4 (Expo: własne moduły podnoszą podspec do 16.4)
  s.source         = { git: '' }
  s.static_framework = true
  s.swift_version  = '5.9'
  # ActivityKit istnieje od iOS 16.1 — słabe linkowanie zostało z czasów minimum 15.1 (od SDK 56 aplikacja wymaga 16.4, więc
  # framework zawsze jest; nieszkodliwe). Sprawdzenia #available(iOS 16.2) w Swifcie zostają: RestTimerAttributes.swift jest
  # wspólny z widżetem, który ma deploymentTarget 16.2.
  s.weak_frameworks = 'ActivityKit'
  s.dependency 'ExpoModulesCore'
  s.pod_target_xcconfig = { 'DEFINES_MODULE' => 'YES', 'SWIFT_COMPILATION_MODE' => 'wholemodule' }
  s.source_files = "ios/**/*.{h,m,mm,swift,hpp,cpp}"
end
