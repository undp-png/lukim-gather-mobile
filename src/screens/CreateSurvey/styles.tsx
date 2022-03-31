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
        color: '#00518B',
    },
    change: {
        fontSize: 14,
        lineHeight: 20,
        fontFamily: 'Inter-Regular',
        color: '#00518B',
    },
    title: {
        fontSize: 16,
        fontFamily: 'Inter-Medium',
        lineHeight: 19,
        marginTop: 32,
        marginBottom: 11,
        color: '#70747E',
    },
    addImages: {
        postition: 'relative',
        height: 122,
    },
    photosWrapper: {
        paddingRight: '50%',
    },
    imgPickerWrapper: {
        position: 'absolute',
        left: '50%',
        backgroundColor: 'transparent',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        paddingLeft: 20,
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
        color: '#101828',
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
        borderColor: '#6AA12A',
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
    surveyImageWrapper: {
        position: 'relative',
    },
    surveyImage: {
        borderRadius: 8,
        height: 122,
        width: 162,
        resizeMode: 'cover',
        backgroundColor: '#ffc',
        marginRight: 10,
    },
    closeIcon: {
        position: 'absolute',
        right: 18,
        top: 8,
    },
});
