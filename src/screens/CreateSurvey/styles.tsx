import {StyleSheet} from 'react-native';

import COLORS from 'utils/colors';

export default StyleSheet.create({
    container: {
        height: '100%',
        paddingHorizontal: 20,
        backgroundColor: COLORS.white,
    },
    categoryCont: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    category: {
        paddingVertical: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    categoryIcon: {
        height: 30,
        width: 30,
        resizeMode: 'contain',
        marginRight: 10,
    },
    field: {
        fontSize: 24,
        lineHeight: 29.05,
        fontFamily: 'Inter-SemiBold',
        color: COLORS.blueTextAlt,
    },
    change: {
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
        marginBottom: 50,
    },
    feeelWrapper: {
        position: 'relative',
        height: 56,
        width: '32%',
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    activeFeel: {
        backgroundColor: '#F0F3F6',
        borderColor: COLORS.primary,
    },
    checked: {
        position: 'absolute',
        top: 3,
        left: 3,
    },
    hide: {
        display: 'none',
    },
    feelIcon: {
        fontSize: 20,
    },
});
