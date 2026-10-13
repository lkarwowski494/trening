# Connect IQ Mobile SDK dla iOS (binarny xcframework dostawcy zegarka). Licencja dostawcy zabrania umieszczania SDK na serwerach i redystrybucji,
# więc NIE ma go w naszym repozytorium: `pod install` pobiera repozytorium dostawcy w ustalonej wersji (tag) i podpina gotowy xcframework.
# Wersja i adres: https://github.com/garmin/connectiq-companion-app-sdk-ios (Package.swift: binaryTarget ConnectIQ.xcframework). Podniesienie wersji = decyzja
# po przeczytaniu warunków licencji (docs/35-zegarek-garmin.md).
Pod::Spec.new do |s|
  s.name             = 'ConnectIQ'
  s.version          = '1.8.0'
  s.summary          = 'Connect IQ Mobile SDK (binary framework from the watch vendor)'
  s.homepage         = 'https://github.com/garmin/connectiq-companion-app-sdk-ios'
  s.license          = { :type => 'Proprietary', :text => 'Connect IQ SDK license agreement: https://developer.garmin.com/connect-iq/sdk/' }
  s.author           = 'the watch vendor'
  s.platforms        = { :ios => '12.0' }
  s.source           = { :git => 'https://github.com/garmin/connectiq-companion-app-sdk-ios.git', :tag => '1.8.0' }
  s.vendored_frameworks = 'ConnectIQ.xcframework'
end
