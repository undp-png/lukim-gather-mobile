import {StyleSheet} from 'react-native';

import COLORS from 'utils/colors';

export default StyleSheet.create({
    title: {
        fontSize: 16,
        fontFamily: 'Inter-Medium',
        color: COLORS.inputText,
    },
    input: {
        marginVertical: 8,
        borderRadius: 8,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: COLORS.border,
        paddingVertical: 4,
        paddingHorizontal: 16,
    },
    hints: {
        marginTop: 4,
        fontFamily: 'Inter-Regular',
        color: COLORS.inputText,
    },
    inputText: {
        fontSize: 16,
        fontFamily: 'Inter-Regular',
        color: COLORS.tertiary,
    },
    radioInput: {
        display: 'flex',
        flexDirection: 'row-reverse',
        marginRight: 'auto',
    },
    radioButton: {
        marginRight: 20,
    },
    inputWarning: {
        borderColor: COLORS.warning,
    },
    inputError: {
        borderColor: COLORS.error,
    },
    warningText: {
        color: COLORS.warning,
    },
    errorText: {
        color: COLORS.error,
    },
});
