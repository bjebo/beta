// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Configure the transformer for SVG files
config.transformer.babelTransformerPath = require.resolve('react-native-svg-transformer');

// Remove "svg" from assetExts and add it to sourceExts
config.resolver.assetExts = config.resolver.assetExts.filter(ext => ext !== 'svg');
config.resolver.sourceExts.push('svg');

// Add an alias so "missing-asset-registry-path" resolves correctly.
config.resolver.extraNodeModules = {
  'missing-asset-registry-path': require.resolve('react-native/Libraries/Image/AssetRegistry'),
};

module.exports = config;
