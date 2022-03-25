import {StyleSheet} from 'react-native';

import COLORS from 'utils/colors';

export default StyleSheet.create({
    container: {
        height: '100%',
        backgroundColor: COLORS.white,
    },
    category: {
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    categoryIcon: {
        height: 24,
        width: 24,
        resizeMode: 'contain',
        marginRight: 10,
    },
    field: {
        fontSize: 24,
        lineHeight: 29.05,
        fontFamily: 'Inter-SemiBold',
        color: COLORS.blueTextAlt,
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
    feeelWrapper: {
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
        backgroundColor: '#ffc',
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
