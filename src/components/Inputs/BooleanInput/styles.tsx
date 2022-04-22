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
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
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
    warningText: {
        color: COLORS.warning,
    },
    errorText: {
        color: COLORS.error,
    },
});
