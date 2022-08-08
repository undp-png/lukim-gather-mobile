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
            '|react-native-image-crop-picker' +
            '|react-native-reanimated' +
            '|react-native-modal' +
            '|react-native-animatable' +
            '|react-native-flipper' +
            '|react-native-geolocation-service' +
            '|react-native-modal-datetime-picker' +
            '|react-native-multiple-select' +
            '|react-native-vector-icons' +
            '|react-native-splash-screen' +
            '|react-native-webview' +
            '|react-native-dropdown-picker' +
            '|react-native-code-push' +
            '|react-native-view-shot' +
            '|@react-native-community/cameraroll' +
            '|rn-fetch-blob' +
            ')/)',
    ],
    testPathIgnorePatterns: ['src/vendor', 'node_modules'],
    timers: 'fake',
};
