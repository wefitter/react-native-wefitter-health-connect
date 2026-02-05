const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {};
const blacklist = require('metro-config/src/defaults/exclusionList');
module.exports = mergeConfig(getDefaultConfig(__dirname), config);
