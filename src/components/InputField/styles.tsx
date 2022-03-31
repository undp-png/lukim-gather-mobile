import {StyleSheet} from 'react-native';

import COLORS from 'utils/colors';

export default StyleSheet.create({
    container: {
        marginTop: 24,
    },
    title: {
        fontSize: 16,
        fontFamily: 'Inter-Medium',
        color: COLORS.inputText,
    },
    titleDark: {
        color: COLORS.greyText,
    },
    inputContainer: {
        position: 'relative',
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
    },
    searchIconWrapper: {
        position: 'absolute',
        left: 12,
        top: '35%',
    },
    iconWrapper: {
        position: 'absolute',
        right: 12,
        top: '40%',
    },
    focused: {
        borderColor: COLORS.primaryAlt,
    },
    password: {
        paddingRight: 44,
    },
    search: {
        paddingLeft: 44,
        height: 40,
        paddingVertical: 8,
    },
});
