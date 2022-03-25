module.exports = {
    preset: 'react-native',
    moduleNameMapper: {
        '^d3-(.*)$': 'd3-$1/dist/d3-$1',
    },
    setupFilesAfterEnv: ['@react-native-mapbox-gl/maps/setup-jest'],
    setupFiles: ['./node_modules/react-native-gesture-handler/jestSetup.js'],
    transformIgnorePatterns: [
        'node_modules/(?!(@react-native|react-native' +
            '|@react-navigation' +
            '|react-native-gesture-handler' +
            '|@react-native-mapbox-gl' +
            '|react-native-reanimated' +
            '|react-native-modal' +
            '|react-native-animatable' +
            ')/)',
    ],
    testPathIgnorePatterns: ['src/vendor', 'node_modules'],
    timers: 'fake',
};
