import {StyleSheet} from 'react-native';

import COLORS from 'utils/colors';

export default StyleSheet.create({
    title: {
        fontSize: 16,
        fontFamily: 'Inter-Medium',
        color: COLORS.inputText,
    },
    input: {
        height: 56,
        marginTop: 8,
        paddingLeft: 12,
        paddingRight: 12,
        fontSize: 16,
        fontFamily: 'Inter-Regular',
        color: COLORS.tertiary,
        borderWidth: 1,
        borderRadius: 8,
        borderColor: COLORS.border,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    inputText: {
        fontSize: 16,
        fontFamily: 'Inter-Regular',
        color: COLORS.tertiary,
    },
    inputError: {
        borderColor: COLORS.error,
    },
    inputWarning: {
        borderColor: COLORS.warning,
    },
    warningText: {
        color: COLORS.warning,
    },
    errorText: {
        color: COLORS.error,
    },
});
