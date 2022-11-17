import type {Storage} from 'redux-persist';
import {MMKV} from 'react-native-mmkv';

type CreateStorage = (storage: InstanceType<typeof MMKV>) => Storage;

export const createStorage: CreateStorage = storage => ({
    setItem: (key: string, value: string) => {
        storage.set(key, value);
        return Promise.resolve(true);
    },
    getItem: (key: string) => {
        const value = storage.getString(key);
        return Promise.resolve(value);
    },
    removeItem: (key: string) => {
        storage.delete(key);
        return Promise.resolve(true);
    },
});

export default createStorage;

export const cacheStorage = createStorage(new MMKV());
export const queueStorage = createStorage(new MMKV());
