import {StyleSheet} from 'react-native';

import COLORS from 'utils/colors';

export default StyleSheet.create({
    container: {
        height: '100%',
        paddingHorizontal: 10,
        backgroundColor: COLORS.white,
    },
    infoWrapper: {
        marginTop: 10,
        alignItems: 'flex-end',
    },
    info: {
        fontSize: 16,
        fontWeight: '500',
        fontFamily: 'Inter-Medium',
        color: COLORS.primaryBlue,
    },
    button: {
        marginTop: 32,
    },
    text: {
        color: COLORS.primary,
        marginTop: 'auto',
        marginBottom: 40,
        textAlign: 'center',
        fontSize: 14,
        fontWeight: '400',
        fontFamily: 'Inter-Regular',
    },
});
