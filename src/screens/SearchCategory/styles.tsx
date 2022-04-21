import {StyleSheet, Dimensions, Platform} from 'react-native';

const {width} = Dimensions.get('window');

import COLORS from 'utils/colors';

export default StyleSheet.create({
    searchWrapper: {
        marginRight: -25,
        marginLeft: Platform.OS === 'ios' ? -30 : 0,
        flexDirection: 'row',
        alignItems: 'center',
        width: width - 70,
        backgroundColor: '#E7ECF2',
        borderWidth: 1,
        borderColor: COLORS.primaryAlt,
        borderRadius: 8,
        paddingHorizontal: 10,
    },
    searchInput: {
        height: 40,
        width: width - 136,
        fontFamily: 'Inter-Medium',
        color: COLORS.inputText,
    },
    container: {
        backgroundColor: COLORS.white,
        borderTopWidth: 10,
        borderTopColor: '#F0F3F6',
    },
    subCategoryList: {
        padding: 20,
        height: '100%',
    },
    subCategory: {
        marginHorizontal: 5,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    iconWrapper: {
        paddingVertical: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    categoryIcon: {
        height: 20,
        width: 20,
        resizeMode: 'contain',
    },
    categoryName: {
        marginLeft: 10,
        fontSize: 16,
        fontFamily: 'Inter-Medium',
        lineHeight: 19.36,
        color: COLORS.greyTextDark,
    },
});
