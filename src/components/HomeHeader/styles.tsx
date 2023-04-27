import {StyleSheet} from 'react-native';

import COLORS from 'utils/colors';

export default StyleSheet.create({
    header: {
        position: 'absolute',
        right: 0,
        left: 0,
        top: 0,
        zIndex: 5,
        paddingTop: 45,
        paddingBottom: 5,
        paddingHorizontal: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    homeHeader: {
        backgroundColor: 'transparent',
    },
    homeScreenTab: {
        marginBottom: 0,
        backgroundColor: '#fff',
        shadowOffset: {
            width: 2,
            height: 5,
        },
        shadowOpacity: 0.08,
        shadowColor: '#000',
        textShadowRadius: 10,
        elevation: 10,
    },
    tabStyle: {
        marginBottom: 0,
    },
    activeTabStyle: {
        backgroundColor: '#DCE3E9',
    },
    activeTabTitle: {
        color: COLORS.blueTextAlt,
    },
    rightBar: {
        display: 'flex',
        flexDirection: 'row',
    },
    searchBar: {
        backgroundColor: '#E7EEF6',
        borderRadius: 20,
        padding: 8,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    exportBar: {
        backgroundColor: '#E7EEF6',
        borderRadius: 20,
        padding: 6,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    exportIcon: {
        height: 26,
        width: 26,
        resizeMode: 'contain',
    },
    whiteBg: {
        backgroundColor: '#fff',
        shadowOffset: {
            width: 2,
            height: 5,
        },
        shadowOpacity: 0.08,
        shadowColor: '#000',
        textShadowRadius: 10,
        elevation: 10,
    },
    rightMargin: {
        marginRight: 8,
    },
    menuBar: {
        backgroundColor: COLORS.blueTextAlt,
        height: 40,
        borderRadius: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 10,
    },
    title: {
        marginLeft: 5,
        fontSize: 12,
        lineHeight: 16,
        fontFamily: 'Inter-SemiBold',
        color: '#fff',
    },
    shadowItem: {
        shadowOffset: {
            width: 2,
            height: 5,
        },
        shadowOpacity: 0.08,
        shadowColor: '#000',
        textShadowRadius: 10,
        elevation: 10,
    },
    filterButton: {
        position: 'absolute',
        top: 104,
        left: 15,
        zIndex: 6,
        backgroundColor: '#fff',
        borderRadius: 255,
        elevation: 10,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    clearButton: {
        marginLeft: 4,
        marginRight: 12,
    },
    clearText: {
        color: COLORS.greyTextDark,
        fontSize: 12,
        fontFamily: 'Inter-Medium',
    },
    filterButtonLower: {
        top: 158,
    },
    filterButtonListView: {
        left: 20,
    },
    filterButtonTouchable: {
        padding: 8,
        borderRadius: 255,
    },
    filterButtonTouchableContent: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    filterButtonTouchableText: {
        marginHorizontal: 6,
    },
    filterButtonTouchableActive: {
        backgroundColor: COLORS.backgroundLight,
        borderWidth: 1,
        borderColor: COLORS.background,
        elevation: 2,
    },
    filtersContainer: {
        position: 'absolute',
        top: 96,
        right: 15,
        left: 15,
        zIndex: 6,
        backgroundColor: 'transparent',
        borderRadius: 8,
    },
    filtersContainerListView: {
        marginBottom: 10,
        right: 20,
        left: 20,
        paddingVertical: 6,
        zIndex: 10,
    },
});
