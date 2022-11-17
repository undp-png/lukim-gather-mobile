declare module 'apollo-upload-client';
declare module 'turf-point';
declare module 'turf-polygon';
declare module 'react-native-static-server';

declare module 'assets/*.png';

declare module 'apollo-cache-inmemory' {
    export type NormalizedCacheObject = any;
}

declare module '@env' {
    export const BASE_URL: string;
    export const MAPBOX_ACCESS_TOKEN: string;
    export const CODEPUSH_DEPLOYMENT_KEY_ANDROID: string;
    export const CODEPUSH_DEPLOYMENT_KEY_IOS: string;
    export const HIDE_LOGBOX: string;
}
