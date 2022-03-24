import {StyleSheet} from 'react-native';

import COLORS from 'utils/colors';

export default StyleSheet.create({
    container: {
        height: '100%',
        paddingHorizontal: 20,
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
    signUp: {
        marginTop: 'auto',
        marginBottom: 40,
        alignItems: 'center',
    },
    text: {
        color: COLORS.primary,
        fontSize: 14,
        fontWeight: '400',
        fontFamily: 'Inter-Regular',
    },
});
