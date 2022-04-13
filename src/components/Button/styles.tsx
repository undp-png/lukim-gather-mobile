import {StyleSheet} from 'react-native';

import COLORS from 'utils/colors';

export default StyleSheet.create({
    button: {
        alignSelf: 'stretch',
        backgroundColor: COLORS.secondary,
        borderRadius: 8,
    },
    buttonContent: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 49,
        paddingHorizontal: 20,
    },
    buttonDark: {
        backgroundColor: '#284362',
    },
    buttonLight: {
        backgroundColor: COLORS.border,
    },
    buttonLightGreen: {
        backgroundColor: '#F0F6EA',
    },
    buttonDisabled: {
        opacity: 0.8,
    },
    buttonText: {
        color: COLORS.white,
        fontSize: 16,
        lineHeight: 19.63,
        fontFamily: 'Inter-Medium',
    },
    textDark: {
        color: COLORS.secondary,
    },
    textLight: {
        color: COLORS.primary,
    },
});
