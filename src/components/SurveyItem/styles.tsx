import {StyleSheet, Dimensions} from 'react-native';

import COLORS from 'utils/colors';

const {width} = Dimensions.get('window');

export default StyleSheet.create({
    container: {
        borderTopWidth: 10,
        borderTopColor: COLORS.white,
        height: '100%',
        backgroundColor: '#E7ECF2',
        padding: 20,
    },
    searchInput: {
        paddingHorizontal: 10,
        height: 40,
        width: width - 70,
        marginRight: -25,
        backgroundColor: '#E7ECF2',
        borderWidth: 1,
        borderColor: '#708297',
        borderRadius: 8,
    },
    item: {
        backgroundColor: COLORS.white,
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    title: {
        fontSize: 16,
        lineHeight: 19.36,
        fontFamily: 'Inter-Medium',
        color: COLORS.tertiary,
        marginBottom: 8,
    },
    category: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    categoryIcon: {
        height: 18,
        width: 18,
        resizeMode: 'contain',
        marginRight: 5,
    },
    field: {
        fontSize: 14,
        lineHeight: 20,
        fontFamily: 'Inter-Regular',
        color: COLORS.blueText,
    },
    rightData: {
        justifyContent: 'flex-end',
    },
    date: {
        fontSize: 12,
        lineHeight: 16,
        fontFamily: 'Inter-Regular',
        color: COLORS.inputText,
    },
    tabWrapper: {
        flexDirection: 'row',
        backgroundColor: COLORS.border,
        padding: 2,
        borderRadius: 8,
        marginBottom: 20,
    },
    tabItem: {
        width: width / 2 - 22,
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
});
