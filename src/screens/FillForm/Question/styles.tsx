import {StyleSheet} from 'react-native';

import COLORS from 'utils/colors';

export default StyleSheet.create({
    fieldContainer: {
        marginBottom: 24,
    },
    inputContainer: {
        marginTop: 0,
    },
    descriptionContainer: {
        padding: 12,
        marginBottom: 24,
        borderWidth: 1,
        borderRadius: 8,
        borderColor: COLORS.border,
    },
    descriptionTitle: {
        fontSize: 16,
        color: COLORS.greyTextDark,
        fontFamily: 'Inter-SemiBold',
    },
    descriptionText: {
        fontSize: 16,
        fontFamily: 'Inter-Regular',
        color: COLORS.tertiary,
    },
    textarea: {
        height: 156,
    },
});
