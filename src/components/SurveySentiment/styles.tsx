import {StyleSheet} from 'react-native';

import COLORS from 'utils/colors';

export default StyleSheet.create({
    feeelWrapper: {
        position: 'relative',
        height: 56,
        width: '32%',
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    activeFeel: {
        backgroundColor: '#F0F3F6',
        borderColor: COLORS.secondary,
    },
    checked: {
        position: 'absolute',
        top: 3,
        left: 3,
    },
    hide: {
        display: 'none',
    },
    feelIcon: {
        fontSize: 20,
    },
});
