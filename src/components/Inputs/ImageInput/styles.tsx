import {StyleSheet} from 'react-native';

import COLORS from 'utils/colors';

export default StyleSheet.create({
    title: {
        fontSize: 16,
        fontFamily: 'Inter-Medium',
        color: COLORS.inputText,
    },
    hints: {
        marginTop: 4,
        fontFamily: 'Inter-Regular',
        color: COLORS.inputText,
    },
    input: {
        marginVertical: 8,
        fontSize: 16,
        borderWidth: 1,
        borderRadius: 8,
        borderColor: COLORS.border,
        padding: 8,
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
    image: {
        width: 64,
        height: 64,
    },
});
