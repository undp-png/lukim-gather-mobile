module.exports = {
    preset: 'react-native',
    setupFiles: [
        './node_modules/react-native-gesture-handler/jestSetup.js',
    ],
    transformIgnorePatterns: [
        'node_modules/(?!(@react-native|react-native' +
            '|@react-navigation' +
            '|react-native-gesture-handler' +
            ')/)',
    ],
    testPathIgnorePatterns: ['src/vendor', 'node_modules'],
    timers: 'fake',
};
