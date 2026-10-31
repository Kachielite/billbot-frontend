const { withPodfile } = require('@expo/config-plugins');

// GoogleUtilities and RecaptchaInterop (pulled in via @react-native-google-signin/google-signin's
// AppCheckCore dependency) don't define Swift modules. When CocoaPods links pods as static
// libraries, AppCheckCore (a Swift pod) can't import them unless they opt into modular headers.
// See: https://github.com/CocoaPods/CocoaPods/issues/10425
const MODULAR_HEADER_PODS = ['GoogleUtilities', 'RecaptchaInterop'];

module.exports = function withPodfileModularHeaders(config) {
  return withPodfile(config, (config) => {
    const { contents } = config.modResults;

    if (
      MODULAR_HEADER_PODS.every((pod) =>
        contents.includes(`pod '${pod}', :modular_headers => true`),
      )
    ) {
      return config;
    }

    const podLines = MODULAR_HEADER_PODS.map(
      (pod) => `  pod '${pod}', :modular_headers => true`,
    ).join('\n');

    config.modResults.contents = contents.replace(/(target '[^']+' do\n)/, `$1${podLines}\n`);

    return config;
  });
};
