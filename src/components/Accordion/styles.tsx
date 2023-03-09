import {StyleSheet} from 'react-native';

import COLORS from 'utils/colors';

export default StyleSheet.create({
    container: {
        backgroundColor: COLORS.white,
    },
    header: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#f0f3f6',
        paddingHorizontal: 12,
        paddingVertical: 16,
        marginBottom: 12,
        borderRadius: 4,
    },
    headerTitle: {
        fontSize: 16,
        fontFamily: 'Inter-Medium',
        color: COLORS.tertiary,
        lineHeight: 19.36,
    },
    content: {
        color: COLORS.greyText,
        fontSize: 14,
        lineHeight: 20,
        fontFamily: 'Inter-Regular',
        marginBottom: 24,
    },
});
