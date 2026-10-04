#!/usr/bin/env bash
# Build na urządzenie („Any iOS Device”) wymaga, żeby platforma iOS zgodna z SDK wybranego Xcode była zainstalowana —
# inaczej xcodebuild kończy się „iOS X.Y is not installed” (przebieg 37123785083 na Xcode 16.2 / iOS 18.2).
# Obraz macos-26 (od SDK 56) ma środowiska iOS 26.2/26.4/26.5 — dla domyślnego wyboru Xcode 26.6 (SDK iOS 26.5) zwykle nic
# nie pobieramy; pobranie tylko, gdy brakuje (np. po zmianie obrazu). Dopasowanie „iOS 26.4( |.)” obejmuje też 26.4.1.
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
