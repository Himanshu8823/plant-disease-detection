// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Optional: If you are facing symlink issues or other specific cases, 
// you can adjust the resolver settings like this.
config.resolver = {
  ...config.resolver,
  // Here, you can add any file extensions you want to support
  assetExts: config.resolver.assetExts.filter((ext) => ext !== 'db'), // Example modification
  sourceExts: [...config.resolver.sourceExts, 'db'],
};

// If you have symlinks in your project, you can also add watchFolders
// config.watchFolders = [
//   // Add your symlinked directories if any
// ];

module.exports = config;
