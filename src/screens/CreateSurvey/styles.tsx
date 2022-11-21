import {StyleSheet} from 'react-native';

import COLORS from 'utils/colors';

export default StyleSheet.create({
    container: {
        height: '100%',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: COLORS.white,
    },
    contentContainer: {
        paddingBottom: 50,
    },
    existingContainer: {
        backgroundColor: '#F0F3F7',
        marginBottom: 24,
        paddingVertical: 16,
        paddingHorizontal: 12,
        borderRadius: 8,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    infoIcon: {
        margin: 2,
    },
    goIconContainer: {
        alignSelf: 'center',
    },
    goIconTouchable: {
        padding: 6,
        backgroundColor: COLORS.white,
        borderRadius: 22,
        elevation: 1,
    },
    goIcon: {
        padding: 16,
    },
    existingText: {
        color: COLORS.greyTextDark,
        fontFamily: 'Inter-Regular',
        lineHeight: 20,
        fontSize: 14,
        marginHorizontal: 8,
        flexShrink: 1,
        paddingRight: 16,
    },
    header: {
        paddingBottom: 12,
        paddingTop: 8,
        borderBottomWidth: 1,
        borderColor: '#E7EEF6',
        marginBottom: 20,
    },
    headerText: {
        fontSize: 16,
        fontFamily: 'Inter-Medium',
        color: COLORS.greyTextDark,
    },
    categoryCont: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    category: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    categoryIcon: {
        height: 30,
        width: 30,
        resizeMode: 'contain',
        marginRight: 10,
    },
    projectInput: {
        marginTop: 24,
    },
    field: {
        fontSize: 24,
        lineHeight: 29.05,
        fontFamily: 'Inter-SemiBold',
        color: COLORS.blueTextAlt,
        width: '70%',
    },
    change: {
        paddingVertical: 10,
        fontSize: 14,
        lineHeight: 20,
        fontFamily: 'Inter-Regular',
        color: COLORS.blueTextAlt,
    },
    title: {
        fontSize: 16,
        fontFamily: 'Inter-Medium',
        lineHeight: 19,
        marginTop: 32,
        marginBottom: 11,
        color: '#70747E',
    },
    locationCont: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    locationWrapper: {
        flex: 1,
        borderWidth: 1,
        borderRadius: 8,
        borderColor: '#CCDCE8',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        marginRight: 14,
    },
    countyName: {
        color: COLORS.tertiary,
        marginLeft: 14,
        fontSize: 16,
        fontFamily: 'Inter-Regular',
    },
    feelings: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    textarea: {
        height: 156,
        marginBottom: 20,
    },
    spaceLeft: {
        marginLeft: 10,
    },
    feelIcon: {
        fontSize: 20,
    },
    anonymousInput: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    titleText: {
        fontSize: 16,
        fontFamily: 'Inter-Medium',
        lineHeight: 19,
        color: '#70747E',
    },
    message: {
        fontSize: 12,
        fontFamily: 'Inter-Regular',
        marginTop: 4,
        color: '#70747E',
    },
});
