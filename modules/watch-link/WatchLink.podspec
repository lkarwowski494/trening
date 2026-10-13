require 'json'
package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

Pod::Spec.new do |s|
  s.name           = 'WatchLink'
  s.version        = package['version']
  s.summary        = 'WatchConnectivity bridge between the iPhone app and the Apple Watch app'
  s.description    = 'Sends workout snapshots to the watch, receives watch events (queued durably) and can wake the watch app.'
  s.author         = ''
  s.homepage       = 'https://github.com/lkarwowski494/trening'
  s.platforms      = { :ios => '16.4' }
  s.source         = { git: '' }
  s.static_framework = true
  s.swift_version  = '5.9'
  s.frameworks     = 'WatchConnectivity', 'HealthKit'
  s.dependency 'ExpoModulesCore'
  s.pod_target_xcconfig = { 'DEFINES_MODULE' => 'YES', 'SWIFT_COMPILATION_MODE' => 'wholemodule' }
  s.source_files = "ios/**/*.{h,m,mm,swift,hpp,cpp}"
end
