const { withPodfileProperties } = require('@expo/config-plugins');

// The OneSignalNotificationServiceExtension target links OneSignalXCFramework
// (a precompiled XCFramework). Without `ios.useFrameworks` set, CocoaPods only
// links it via raw linker flags and never processes/copies the individual
// .framework bundles, so `import OneSignalExtension` fails to resolve at
// compile time ("no such module 'OneSignalExtension'"). CocoaPods also
// requires a host app and its embedded extension to agree on framework
// linkage, so this must apply to the whole project, not just the extension.
module.exports = function withOneSignalUseFrameworks(config) {
  return withPodfileProperties(config, (config) => {
    config.modResults['ios.useFrameworks'] = 'static';
    return config;
  });
};
