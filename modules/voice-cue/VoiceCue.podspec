require 'json'
package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

Pod::Spec.new do |s|
  s.name           = 'VoiceCue'
  s.version        = package['version']
  s.summary        = 'Spoken rest-start announcements with music ducking'
  s.description    = 'Speaks short announcements (AVSpeechSynthesizer) through headphones or the phone speaker and ducks other audio for the length of the sentence.'
  s.author         = ''
  s.homepage       = 'https://github.com/lkarwowski494/trening'
  s.platforms      = { :ios => '16.4' }
  s.source         = { git: '' }
  s.static_framework = true
  s.swift_version  = '5.9'
  s.dependency 'ExpoModulesCore'
  s.pod_target_xcconfig = { 'DEFINES_MODULE' => 'YES', 'SWIFT_COMPILATION_MODE' => 'wholemodule' }
  s.source_files = "ios/**/*.{h,m,mm,swift,hpp,cpp}"
end
