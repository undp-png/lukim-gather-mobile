import {MMKV} from 'react-native-mmkv';

export const createStorage = storage => ({
    setItem: (key, value) => {
        storage.set(key, value);
        return Promise.resolve(true);
    },
    getItem: key => {
        const value = storage.getString(key);
        return Promise.resolve(value);
    },
    removeItem: key => {
        storage.delete(key);
        return Promise.resolve(true);
    },
});

export default createStorage;

export const cacheStorage = createStorage(new MMKV());
export const queueStorage = createStorage(new MMKV());
