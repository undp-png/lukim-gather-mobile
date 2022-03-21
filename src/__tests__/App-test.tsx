/**
 * @format
 */

import 'react-native';
import React from 'react';
import App from '../App';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

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

jest.mock('react-native-keyboard-aware-scroll-view', () => {
    const KeyboardAwareScrollView = ({children}) => children;
    return {KeyboardAwareScrollView};
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

jest.mock('react-native-simple-toast', () => {
    return {
        show: jest.fn(),
        showWithGravity: jest.fn(),
    };
});

it('renders correctly', () => {
    renderer.create(<App />);
});
