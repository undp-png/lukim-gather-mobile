import {StyleSheet} from 'react-native';

import COLORS from 'utils/colors';

export default StyleSheet.create({
    page: {
        backgroundColor: COLORS.background,
    },
    container: {
        height: '100%',
        width: '100%',
        backgroundColor: COLORS.background,
    },
    map: {
        flex: 1,
    },
    locationBar: {
        position: 'absolute',
        bottom: 100,
        right: 20,
        zIndex: 5,
    },
    locationWrapper: {
        backgroundColor: '#fff',
        height: 35,
        width: 35,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    locationIcon: {
        height: 20,
        width: 20,
    },
});
