module.exports = {
  preset: '@react-native/jest-preset',
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community|-async-storage)?|@react-navigation|react-native-safe-area-context|react-native-gesture-handler|react-native-screens|react-native-svg|lucide-react-native)/)',
  ],
  setupFiles: ['react-native-gesture-handler/jestSetup'],
  moduleNameMapper: { '^lucide-react-native$': '<rootDir>/node_modules/lucide-react-native/dist/cjs/lucide-react-native.js' },
};
