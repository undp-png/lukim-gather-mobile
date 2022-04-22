import {Platform, Linking, Alert} from 'react-native';
import {request, PERMISSIONS, RESULTS} from 'react-native-permissions';

import {_} from 'services/i18n';

export const checkLocation = async () => {
    const permission =
        Platform.OS === 'ios'
            ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
            : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
    try {
        const result = await request(permission);
        if (result === RESULTS.GRANTED) {
            return true;
        } else if (__DEV__ && result === RESULTS.UNAVAILABLE) {
            return false;
        } else if (result === RESULTS.DENIED || result === RESULTS.BLOCKED) {
            Alert.alert(
                _('Location permission denied'),
                _('Please go to app settings and allow location permission.'),
                [
                    {
                        text: _('Cancel'),
                        style: 'cancel',
                    },
                    {
                        text: _('Go to Settings'),
                        style: 'default',
                        onPress: () => Linking.openSettings(),
                    },
                ],
                {
                    cancelable: true,
                },
            );
            return false;
        }
    } catch (err) {
        return false;
    }
};
