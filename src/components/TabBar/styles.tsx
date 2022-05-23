import {StyleSheet, Dimensions} from 'react-native';

const {height, width} = Dimensions.get('window');

import COLORS from 'utils/colors';

export default StyleSheet.create({
    safeArea: {
        position: 'absolute',
        bottom: 0,
    },
    container: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    containerHidden: {
        display: 'none',
    },
    tabBar: {
        flex: 1,
        alignItems: 'center',
    },
    title: {
        color: COLORS.white,
        fontSize: 10,
        marginTop: 6,
    },
    plusButton: {
        height: Math.min(height, width) / 6.5,
        width: Math.min(height, width) / 6.5,
        borderRadius: width / 13,
        bottom: 35,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.blueTextAlt,
    },
    iconWrapper: {
        alignItems: 'center',
        marginBottom: 10,
    },
});
