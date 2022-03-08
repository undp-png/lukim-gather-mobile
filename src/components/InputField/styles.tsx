import {StyleSheet} from 'react-native';

import COLORS from 'utils/colors';

export default StyleSheet.create({
    container: {
        marginTop: 24,
    },
    title: {
        fontSize: 16,
        fontWeight: '500',
        fontFamily: 'Inter-Regular',
        color: COLORS.inputText,
    },
    inputContainer: {
        position: 'relative',
    },
    input: {
        height: 56,
        marginTop: 8,
        paddingLeft: 12,
        fontSize: 16,
        fontWeight: '400',
        fontFamily: 'Inter-Regular',
        color: COLORS.tertiary,
        borderWidth: 1,
        borderRadius: 8,
        borderColor: COLORS.primaryAlt,
    },
    iconWrapper: {
        position: 'absolute',
        right: 12,
        top: '40%',
    },
});
