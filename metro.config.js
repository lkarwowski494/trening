const { getDefaultConfig } = require('expo/metro-config'); const path = require('path');
const config = getDefaultConfig(__dirname);
const map = { 'expo-sqlite': 'sqlite.js', 'expo-notifications': 'notifications.js', '@kingstinct/react-native-healthkit': 'healthkit.js' };
const orig = config.resolver.resolveRequest;
config.resolver.resolveRequest = (ctx, name, platform) => {
  if (platform === 'web') {
    if (map[name]) return { type: 'sourceFile', filePath: path.join(__dirname, 'scripts', 'screens', 'shims', map[name]) };
    if (/modules\/rest-activity$/.test(name) || name === '@/modules/rest-activity') return { type: 'sourceFile', filePath: path.join(__dirname, 'scripts', 'screens', 'shims', 'la.js') };
  }
  return (orig || ctx.resolveRequest)(ctx, name, platform);
};
module.exports = config;
