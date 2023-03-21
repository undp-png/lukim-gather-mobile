import {StyleSheet} from 'react-native';

import COLORS from 'utils/colors';

export default StyleSheet.create({
    container: {
        height: '100%',
        backgroundColor: COLORS.white,
        padding: 20,
    },
    title: {
        marginTop: 24,
        fontSize: 16,
        fontFamily: 'Inter-Regular',
        lineHeight: 24,
        color: COLORS.tertiary,
    },
    resendWrapper: {
        marginTop: 'auto',
        marginBottom: 40,
    },
    text: {
        color: COLORS.blueTextAlt,
        textAlign: 'center',
        fontSize: 14,
        fontWeight: '400',
        fontFamily: 'Inter-Regular',
    },
});
