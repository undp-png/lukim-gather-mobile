import {StyleSheet} from 'react-native';

import COLORS from 'utils/colors';

export default StyleSheet.create({
    container: {
        height: '100%',
        backgroundColor: COLORS.white,
        padding: 20,
    },
    pickerLabel: {
        fontSize: 16,
        lineHeight: 19.36,
        color: COLORS.inputText,
        fontFamily: 'Inter-Medium',
        marginBottom: 5,
    },
    picker: {
        marginBottom: 2,
        borderColor: COLORS.border,
    },
    textStyle: {
        color: COLORS.inputText,
        fontSize: 16,
        fontFamily: 'Inter-Regular',
    },
    labelStyle: {
        color: COLORS.greyText,
        fontSize: 16,
        fontFamily: 'Inter-Regular',
    },
    button: {
        marginVertical: 32,
    },
    description: {
        height: 120,
    },
});
