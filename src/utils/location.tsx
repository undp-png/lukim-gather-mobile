import {Platform} from 'react-native';
import {request, PERMISSIONS, RESULTS} from 'react-native-permissions';

export const checkLocation = async () => {
    const permission =
        Platform.OS === 'ios'
            ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
            : PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION;
    const result = await request(permission);
    if (result === RESULTS.GRANTED) {
        return true;
    } else {
        if (__DEV__ && result === RESULTS.UNAVAILABLE) {
            return false;
        }
    }
};
