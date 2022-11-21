import {StyleSheet} from 'react-native';

import COLORS from 'utils/colors';

export default StyleSheet.create({
    optionItem: {
        flex: 1,
        position: 'relative',
        height: 56,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 8,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    activeOptionItem: {
        borderColor: COLORS.secondary,
        backgroundColor: '#F0F3F6',
    },
    optionItemDisabled: {
        backgroundColor: '#F0F3F6',
    },
    hide: {
        display: 'none',
    },
    optionText: {
        fontSize: 16,
        fontFamily: 'Inter-Regular',
        lineHeight: 19,
        color: COLORS.greyTextDark,
        marginLeft: 6,
    },
    optionTextActive: {
        color: COLORS.accent,
    },
    optionTextDisabled: {
        color: COLORS.inputText,
    },
    checked: {
        position: 'absolute',
        top: 3,
        left: 3,
    },
    spaceLeft: {
        marginLeft: 10,
    },
});
