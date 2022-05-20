import {StyleSheet, Dimensions} from 'react-native';

const {width} = Dimensions.get('window');

import COLORS from 'utils/colors';

export default StyleSheet.create({
    container: {
        backgroundColor: COLORS.white,
        paddingBottom: 100,
    },
    menuItemsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    menu: {
        height: 35,
        marginRight: 25,
        marginVertical: 15,
    },
    menuTitle: {
        fontSize: 24,
        fontFamily: 'Inter-SemiBold',
        color: COLORS.primaryLight,
    },
    menuTitleActive: {
        color: COLORS.blueTextAlt,
    },
    header: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        backgroundColor: '#F0F3F6',
    },
    headerFirst: {
        marginTop: 12,
    },
    headerTitle: {
        fontSize: 16,
        fontFamily: 'Inter-Medium',
        lineHeight: 19.36,
        color: COLORS.greyTextDark,
    },
    subCategoryList: {
        marginHorizontal: 10,
        paddingTop: 25,
        paddingBottom: 30,
    },
    subCategory: {
        marginHorizontal: 5,
        marginBottom: 20,
        backgroundColor: COLORS.white,
    },
    iconWrapper: {
        borderRadius: 12,
        height: 100,
        width: (width - 50) / 3,
        borderWidth: 1,
        borderColor: COLORS.primaryLightAlt,
        justifyContent: 'center',
        alignItems: 'center',
    },
    categoryIcon: {
        height: 60,
        width: 60,
        resizeMode: 'contain',
    },
    categoryName: {
        width: (width - 50) / 3,
        marginTop: 5,
        fontSize: 14,
        fontFamily: 'Inter-SemiBold',
        lineHeight: 16.94,
        color: COLORS.greyTextDark,
        textAlign: 'center',
    },
});
