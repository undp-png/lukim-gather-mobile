import {StyleSheet} from 'react-native';

import COLORS from 'utils/colors';

export default StyleSheet.create({
    container: {
        height: '100%',
        padding: 20,
        backgroundColor: COLORS.white,
    },
    text: {
        color: COLORS.greyTextDark,
        fontSize: 14,
        fontFamily: 'Inter-Regular',
        textAlign: 'center',
    },
    loader: {
        top: '10%',
    },
    description: {
        color: COLORS.greyText,
        fontSize: 14,
        lineHeight: 20,
        fontFamily: 'Inter-Regular',
        marginBottom: 12,
    },
    stats: {
        marginBottom: 24,
    },
    statItem: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 4,
    },
    statItemTitle: {
        flex: 0.4,
        color: COLORS.greyText,
        fontSize: 14,
        lineHeight: 20,
        fontFamily: 'Inter-Medium',
    },
    statItemValue: {
        flex: 0.6,
        fontSize: 14,
        lineHeight: 20,
        fontFamily: 'Inter-SemiBold',
    },
    separator: {
        flexShrink: 1,
        width: 1,
        backgroundColor: COLORS.border,
        borderRadius: 12,
    },
});
