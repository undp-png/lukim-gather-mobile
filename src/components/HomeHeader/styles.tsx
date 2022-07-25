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
        fontSize: 14,
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
});
