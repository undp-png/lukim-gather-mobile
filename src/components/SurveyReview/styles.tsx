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
    activeReviewItem: {
        backgroundColor: '#F0F3F7',
    },
    activeFeel: {
        backgroundColor: '#F0F3F7',
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
});
