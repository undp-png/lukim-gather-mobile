import {StyleSheet} from 'react-native';

import COLORS from 'utils/colors';

export default StyleSheet.create({
    container: {
        alignSelf: 'stretch',
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        lineHeight: 19.36,
        color: COLORS.greyText,
        fontFamily: 'Inter-Medium',
        marginBottom: 5,
    },
    textInput: {
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 8,
        paddingHorizontal: 12,
        fontFamily: 'Inter-Medium',
        color: COLORS.inputText,
    },
    focusedInput: {
        borderColor: COLORS.primaryAlt,
        color: COLORS.tertiary,
    },
});
