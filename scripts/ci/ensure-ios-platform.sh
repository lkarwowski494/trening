#!/usr/bin/env bash
# Build na urządzenie („Any iOS Device”) wymaga, żeby platforma iOS zgodna z SDK wybranego Xcode była zainstalowana —
# inaczej xcodebuild kończy się „iOS X.Y is not installed” (przebieg 37123785083 na Xcode 16.2 / iOS 18.2).
# Obraz macos-15 ma dla Xcode 26.2/26.3 środowisko iOS 26.2, więc zwykle nic nie pobieramy; pobranie tylko, gdy brakuje.
# Uruchamiać po scripts/ci/select-xcode.sh.
set -euo pipefail
SDK="$(xcrun --sdk iphoneos --show-sdk-version)"
echo "SDK iOS wybranego Xcode: ${SDK}"
if xcrun simctl list runtimes | grep -Eq "iOS ${SDK//./\\.}( |\.)"; then
  echo "Platforma iOS ${SDK} jest zainstalowana — bez pobierania."
else
  echo "Brak platformy iOS ${SDK} — pobieram (xcodebuild -downloadPlatform iOS)."
  sudo xcodebuild -downloadPlatform iOS
fi
xcrun simctl list runtimes
