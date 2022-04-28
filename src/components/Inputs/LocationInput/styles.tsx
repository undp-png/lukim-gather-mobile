import {StyleSheet} from 'react-native';

import COLORS from 'utils/colors';

export default StyleSheet.create({
    title: {
        fontSize: 16,
        fontFamily: 'Inter-Medium',
        lineHeight: 19,
        color: '#70747E',
    },
    hints: {
        marginTop: 4,
        fontFamily: 'Inter-Regular',
        color: COLORS.inputText,
    },
    locationCont: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    locationWrapper: {
        flex: 1,
        borderWidth: 1,
        borderRadius: 8,
        borderColor: '#CCDCE8',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        marginRight: 14,
    },
    countyName: {
        color: COLORS.tertiary,
        marginLeft: 14,
        fontSize: 16,
        fontFamily: 'Inter-Regular',
    },
    change: {
        fontSize: 14,
        lineHeight: 20,
        fontFamily: 'Inter-Regular',
        color: COLORS.blueTextAlt,
    },
    inputWarning: {
        borderColor: COLORS.warning,
    },
    inputError: {
        borderColor: COLORS.error,
    },
    errorText: {
        color: COLORS.error,
    },
    warningText: {
        color: COLORS.warning,
    },
    clearText: {
        color: COLORS.blueTextAlt,
        marginVertical: 6,
        fontFamily: 'Inter-Medium',
    },
});
