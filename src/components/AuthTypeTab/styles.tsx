import {StyleSheet} from 'react-native';

import COLORS from 'utils/colors';

export default StyleSheet.create({
    tabWrapper: {
        width: 206, // 2*(tabwidth + wrapper padding)
        flexDirection: 'row',
        backgroundColor: '#DCE3E9',
        padding: 3,
        borderRadius: 100,
        marginBottom: 20,
        alignSelf: 'center',
    },
    tabItem: {
        alignSelf: 'stretch',
        padding: 8,
        borderRadius: 40,
        flex: 1,
        width: 100,
    },
    activeTabItem: {
        backgroundColor: COLORS.white,
    },
    tabTitle: {
        fontSize: 14,
        lineHeight: 20,
        fontFamily: 'Inter-Regular',
        color: COLORS.tertiary,
        textAlign: 'center',
    },
    homeTabTitle: {
        fontFamily: 'Inter-SemiBold',
    },
    message: {
        color: COLORS.greyTextDark,
        fontFamily: 'Inter-Medium',
        textAlign: 'center',
    },
});
