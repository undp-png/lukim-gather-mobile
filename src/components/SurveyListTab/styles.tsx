import {StyleSheet} from 'react-native';

import COLORS from 'utils/colors';

export default StyleSheet.create({
    tabWrapper: {
        flexDirection: 'row',
        backgroundColor: '#DCE3E9',
        padding: 2,
        borderRadius: 8,
        marginBottom: 20,
    },
    tabItem: {
        alignSelf: 'stretch',
        padding: 8,
        borderRadius: 8,
    },
    activeTabItem: {
        backgroundColor: COLORS.white,
    },
    tabTitle: {
        fontSize: 14,
        lineHeight: 20,
        fontFamily: 'Inter-Medium',
        color: COLORS.tertiary,
        textAlign: 'center',
    },
    message: {
        color: COLORS.greyTextDark,
        fontFamily: 'Inter-Medium',
        textAlign: 'center',
    },
});
