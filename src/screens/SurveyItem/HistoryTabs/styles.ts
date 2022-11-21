import {StyleSheet} from 'react-native';

import COLORS from 'utils/colors';

export default StyleSheet.create({
    versionTabs: {
        borderBottomWidth: 1,
        borderColor: '#B6CBE3',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    versionTabsContent: {
        paddingRight: 28,
    },
    versionTabTouchable: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 32,
    },
    versionTabItem: {
        borderRadius: 32,
        marginRight: 4,
    },
    versionTabItemActive: {
        borderRadius: 32,
        backgroundColor: COLORS.blueTextAlt,
    },
    versionTabItemText: {
        fontSize: 14,
        fontFamily: 'Inter-Medium',
        color: COLORS.greyTextDark,
    },
    versionTabItemTextActive: {
        color: COLORS.white,
    },
});
