/**
 * @format
 */

import 'react-native';
import React from 'react';
import mockRNCNetInfo from '@react-native-community/netinfo/jest/netinfo-mock.js';
import mockRNDeviceInfo from 'react-native-device-info/jest/react-native-device-info-mock.js';
import mockRNClipboard from '@react-native-clipboard/clipboard/jest/clipboard-mock.js';

import App from '../App';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

jest.mock('react-native-code-push', () => {
    const cp = () => app => app;
    Object.assign(cp, {
        InstallMode: {},
        CheckFrequency: {},
        SyncStatus: {},
        UpdateState: {},
        DeploymentStatus: {},
        DEFAULT_UPDATE_DIALOG: {},

        allowRestart: jest.fn(),
        checkForUpdate: jest.fn(() => Promise.resolve(null)),
        disallowRestart: jest.fn(),
        getCurrentPackage: jest.fn(() => Promise.resolve(null)),
        getUpdateMetadata: jest.fn(() => Promise.resolve(null)),
        notifyAppReady: jest.fn(() => Promise.resolve()),
        restartApp: jest.fn(),
        sync: jest.fn(() => Promise.resolve(1)),
        clearUpdates: jest.fn(),
    });
    return cp;
});

const mockUserInfo = {
    idToken: 'mockIdToken',
    accessToken: null,
    accessTokenExpirationDate: null,
    serverAuthCode: 'mockServerAuthCode',
    scopes: [],
    user: {
        email: 'mockEmail',
        id: 'mockId',
        givenName: 'mockGivenName',
        familyName: 'mockFamilyName',
        photo: 'mockPhotoUtl',
        name: 'mockFullName',
    },
};

jest.mock('react-native-splash-screen', () => {
    return {
        hide: jest.fn(),
        show: jest.fn(),
    };
});

jest.mock('react-native-geolocation-service', () => ({
    requestAuthorization: jest.fn(),
    getCurrentPosition: jest.fn(),
}));

jest.mock('@react-native-community/netinfo', () => mockRNCNetInfo);

jest.mock('react-native-permissions', () => ({
    request: jest.fn(),
    PERMISSIONS: {},
    RESULTS: {},
}));

jest.mock('react-native-keyboard-aware-scroll-view', () => {
    const KeyboardAwareScrollView = ({children}) => children;
    return {KeyboardAwareScrollView};
});

jest.mock('react-native-version-number', () => {
    return {
        appVersion: '',
        buildVersion: '',
        bundleIdentifier: '',
    };
});

jest.mock('react-native-image-crop-picker', () => {
    return {
        openPicker: jest.fn().mockImplementation(() => Promise.resolve()),
    };
});

jest.mock('react-native-mmkv', () => {
    const mmkvMock = {
        __INTERNAL_MOCK_STORAGE__: {},

        set: jest.fn(async (key, value) => {
            mmkvMock.__INTERNAL_MOCK_STORAGE__[key] = value;

            return null;
        }),

        getString: jest.fn(async key => {
            const result = mmkvMock.__INTERNAL_MOCK_STORAGE__[key]
                ? mmkvMock.__INTERNAL_MOCK_STORAGE__[key]
                : null;

            return result;
        }),

        delete: jest.fn((key: string) => _removeItem(key)),

        clearAll: jest.fn(_clearAll),
        getAllKeys: jest.fn(_getAllKeys),
    };

    async function _removeItem(key: string) {
        if (mmkvMock.__INTERNAL_MOCK_STORAGE__[key]) {
            delete mmkvMock.__INTERNAL_MOCK_STORAGE__[key];
        }
    }

    async function _clearAll() {
        mmkvMock.__INTERNAL_MOCK_STORAGE__ = {};

        return null;
    }

    async function _getAllKeys() {
        return Object.keys(mmkvMock.__INTERNAL_MOCK_STORAGE__);
    }

    return {
        MMKV: jest.fn(() => mmkvMock),
    };
});

jest.mock('redux-persist', () => {
    const real = jest.requireActual('redux-persist');
    return {
        ...real,
        persistReducer: jest
            .fn()
            .mockImplementation((config, reducers) => reducers),
    };
});

jest.mock('react-native-webview', () => {
    return {
        webview: jest.fn(),
    };
});

jest.mock('react-native-static-server', () => {
    return jest.fn().mockImplementation(() => ({
        start: jest.fn(),
        stop: jest.fn(),
        kill: jest.fn(),
    }));
});

jest.mock('react-native-fs', () => {
    return {
        mkdir: jest.fn(),
        moveFile: jest.fn(),
        copyFile: jest.fn(),
        pathForBundle: jest.fn(),
        pathForGroup: jest.fn(),
        getFSInfo: jest.fn(),
        getAllExternalFilesDirs: jest.fn(),
        unlink: jest.fn(),
        exists: jest.fn(),
        stopDownload: jest.fn(),
        resumeDownload: jest.fn(),
        isResumable: jest.fn(),
        stopUpload: jest.fn(),
        completeHandlerIOS: jest.fn(),
        readDir: jest.fn(),
        readDirAssets: jest.fn(),
        existsAssets: jest.fn(),
        readdir: jest.fn(),
        setReadable: jest.fn(),
        stat: jest.fn(),
        readFile: jest.fn(),
        read: jest.fn(),
        readFileAssets: jest.fn(),
        hash: jest.fn(),
        copyFileAssets: jest.fn(),
        copyFileAssetsIOS: jest.fn(),
        copyAssetsVideoIOS: jest.fn(),
        writeFile: jest.fn(),
        appendFile: jest.fn(),
        write: jest.fn(),
        downloadFile: jest.fn(),
        uploadFiles: jest.fn(),
        touch: jest.fn(),
        MainBundlePath: jest.fn(),
        CachesDirectoryPath: jest.fn(),
        DocumentDirectoryPath: jest.fn(),
        ExternalDirectoryPath: jest.fn(),
        ExternalStorageDirectoryPath: jest.fn(),
        TemporaryDirectoryPath: jest.fn(),
        LibraryDirectoryPath: jest.fn(),
        PicturesDirectoryPath: jest.fn(),
    };
});

jest.mock('react-native-view-shot', () => {
    return {};
});

jest.mock('rn-fetch-blob', () => {
    return {
        fs: {
            DocumentDir: '',
            dirs: {
                CacheDir: '',
            },
        },
    };
});

jest.mock('@react-native-firebase/messaging', () => () => ({
    hasPermission: jest.fn(() => Promise.resolve(true)),
    subscribeToTopic: jest.fn(),
    unsubscribeFromTopic: jest.fn(),
    requestPermission: jest.fn(() => Promise.resolve(true)),
    getToken: jest.fn(() => Promise.resolve('mockToken')),
    onTokenRefresh: jest.fn(callback =>
        callback(Promise.resolve('mockRefreshToken')),
    ),
}));

jest.mock('@notifee/react-native', () => {
    return {};
});

jest.mock('@react-native-clipboard/clipboard', () => mockRNClipboard);

jest.mock('@react-native-camera-roll/camera-roll', () => ({
    saveToCameraRoll: jest.fn(),
    getPhotos: jest.fn(),
}));

jest.mock('react-native-siren', () => {
    return {};
});

jest.mock('react-native-device-info', () => ({}));

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter');

it('renders correctly', () => {
    renderer.create(<App />);
});
