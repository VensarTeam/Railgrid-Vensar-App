module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    '@babel/plugin-transform-export-namespace-from',
    ['module:react-native-dotenv', { moduleName: '@env', allowlist: ['API_BASE_URL'], path: '.env' }],
    'react-native-worklets/plugin',
  ],
};
