// Usuwa uprawnienie aps-environment dodawane przez expo-notifications.
// Aplikacja używa tylko powiadomień lokalnych (timer, przypomnienie o podpisie), które go nie potrzebują,
// a darmowe Apple ID (sideload, ADR-025) nie może podpisać aplikacji z uprawnieniem Push Notifications.
const { withEntitlementsPlist } = require('expo/config-plugins');
module.exports = function withoutPushEntitlement(config) {
  return withEntitlementsPlist(config, cfg => { delete cfg.modResults['aps-environment']; return cfg; });
};
