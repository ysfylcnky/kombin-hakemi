const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);
// expo-sqlite's web build imports a .wasm file; the web export only exists to ship the API route.
config.resolver.assetExts.push('wasm');

module.exports = config;
