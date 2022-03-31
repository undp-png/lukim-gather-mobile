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
        bottom: 105,
        right: 20,
        zIndex: 5,
    },
    locationWrapper: {
        backgroundColor: COLORS.white,
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

    markerContainer: {
        alignItems: 'center',
        width: 45,
        backgroundColor: 'transparent',
    },
    markerLine: {
        height: 12,
        width: 2,
        backgroundColor: COLORS.blueTextAlt,
    },
    markerDotOuter: {
        width: 25,
        height: 25,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.white,
    },
    markerDotInner: {
        width: 14,
        height: 14,
        borderRadius: 14,
        backgroundColor: COLORS.blueTextAlt,
    },
});
