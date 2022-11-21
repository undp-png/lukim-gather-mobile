import {StyleSheet} from 'react-native';

import COLORS from 'utils/colors';

export default StyleSheet.create({
    rightBar: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rightMargin: {
        marginRight: 20,
    },
    exportIcon: {
        height: 30,
        width: 30,
        resizeMode: 'contain',
    },
    loader: {
        display: 'flex',
        marginTop: '33%',
    },
    emptyText: {
        color: COLORS.greyTextDark,
        display: 'flex',
        marginTop: '10%',
        alignItems: 'center',
        textAlign: 'center',
        fontFamily: 'Inter-Regular',
    },
    container: {
        height: '100%',
        backgroundColor: COLORS.white,
    },
    updateMessage: {
        marginTop: 20,
        marginHorizontal: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#F0F3F7',
        paddingVertical: 16,
        paddingHorizontal: 12,
        borderRadius: 8,
    },
    updateMessageText: {
        fontFamily: 'Inter-Regular',
        fontSize: 14,
        flexShrink: 1,
    },
    updateButton: {
        alignSelf: 'center',
        marginLeft: 20,
        flexDirection: 'row',
        alignItems: 'center',
        height: 36,
        borderRadius: 50,
        elevation: 2,
        shadowColor: 'rgba(0,0,0,0.05)',
        shadowRadius: 20,
        shadowOffset: {width: 0, height: 5},
    },
    updateButtonText: {
        fontSize: 14,
        fontFamily: 'Inter-Medium',
    },
    versionTabsContainer: {
        backgroundColor: COLORS.white,
    },
    category: {
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
    },
    categoryIcon: {
        height: 30,
        width: 30,
        resizeMode: 'contain',
        marginRight: 10,
    },
    project: {
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    field: {
        fontSize: 24,
        lineHeight: 29.05,
        fontFamily: 'Inter-SemiBold',
        color: COLORS.blueTextAlt,
    },
    offlineIndicator: {
        position: 'absolute',
        backgroundColor: COLORS.accent,
        width: 20,
        height: 20,
        borderRadius: 10,
        right: 10,
        top: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    lastUpdate: {
        paddingHorizontal: 20,
        marginBottom: 16,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    lastUpdateText: {
        marginRight: 6,
        color: COLORS.grey400,
        fontFamily: 'Inter-Regular',
    },
    lastUpdateDate: {
        fontFamily: 'Inter-SemiBold',
        color: COLORS.grey400,
    },
    header: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        backgroundColor: '#F0F3F6',
    },
    headerTitle: {
        fontSize: 16,
        fontFamily: 'Inter-Medium',
        lineHeight: 19.36,
        color: COLORS.blueTextAlt,
    },
    content: {
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: 32,
    },
    name: {
        fontSize: 16,
        fontFamily: 'Inter-Medium',
        lineHeight: 19.36,
        color: COLORS.tertiary,
    },
    feelWrapper: {
        backgroundColor: '#F0F3F7',
        borderWidth: 1,
        borderColor: '#B3CBDC',
        height: 55,
        width: 65,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    photosWrapper: {
        paddingTop: 12,
        paddingBottom: 32,
        paddingLeft: 20,
    },
    surveyImage: {
        borderRadius: 8,
        height: 110,
        width: 150,
        resizeMode: 'cover',
        backgroundColor: '#F0F3F7',
        marginRight: 16,
    },
    feelIcon: {
        fontSize: 20,
    },
    description: {
        fontSize: 16,
        fontFamily: 'Inter-Regular',
        lineHeight: 24,
        color: '#282F3E',
    },
});
