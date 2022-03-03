import {StyleSheet} from 'react-native';

import COLORS from 'utils/colors';

export default StyleSheet.create({
    label: {
        fontSize: 16,
        lineHeight: 19.36,
        color: COLORS.greyText,
        fontFamily: 'Inter-Medium',
        marginBottom: 5,
    },
    pickerWrapper: {
        alignSelf: 'stretch',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 8,
    },
    picker: {
        fontFamily: 'Inter-Medium',
    },
});
