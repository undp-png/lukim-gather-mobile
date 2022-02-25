module.exports = {
    preset: 'react-native',
    setupFilesAfterEnv: ['@react-native-mapbox-gl/maps/setup-jest'],
    setupFiles: ['./node_modules/react-native-gesture-handler/jestSetup.js'],
    transformIgnorePatterns: [
        'node_modules/(?!(@react-native|react-native' +
            '|@react-navigation' +
            '|react-native-gesture-handler' +
            '|@react-native-mapbox-gl' +
            ')/)',
    ],
    testPathIgnorePatterns: ['src/vendor', 'node_modules'],
    timers: 'fake',
};
