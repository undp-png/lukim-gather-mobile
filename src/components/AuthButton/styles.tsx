import {StyleSheet} from 'react-native';

import COLORS from 'utils/colors';

export default StyleSheet.create({
    button: {
        width: '100%',
        height: 49,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.secondary,
    },
    buttonTitle: {
        fontSize: 16,
        fontWeight: '500',
        fontFamily: 'Inter-SemiBold',
    },
});
