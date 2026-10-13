require 'json'
package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

Pod::Spec.new do |s|
  s.name           = 'CiqLink'
  s.version        = package['version']
  s.summary        = 'Link to sports watches running Connect IQ apps (Bluetooth, vendor mobile SDK)'
  s.description    = 'Pairs with a watch through the vendor companion app, sends state snapshots and receives watch events.'
  s.author         = ''
  s.homepage       = 'https://github.com/lkarwowski494/trening'
  s.platforms      = { :ios => '16.4' }
  s.source         = { git: '' }
  s.static_framework = true
  s.swift_version  = '5.9'
  s.dependency 'ExpoModulesCore'
  # Binarny framework dostawcy (licencja: nie umieszczamy go w repozytorium) — pod ConnectIQ.podspec pobierany z repozytorium dostawcy przy `pod install`;
  # wpis w Podfile dodaje plugins/withConnectIq.js.
  s.dependency 'ConnectIQ'
  s.pod_target_xcconfig = { 'DEFINES_MODULE' => 'YES', 'SWIFT_COMPILATION_MODE' => 'wholemodule' }
  s.source_files = "ios/**/*.{h,m,mm,swift,hpp,cpp}"
end
