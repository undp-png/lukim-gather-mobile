import {StyleSheet, Dimensions} from 'react-native';

const {width} = Dimensions.get('window');

import COLORS from 'utils/colors';

export default StyleSheet.create({
    modal: {
        margin: 0,
        flex: 1,
        backgroundColor: '#00000040',
    },
    boxContent: {
        width: width - 40,
        height: '70%',
        alignSelf: 'center',
        backgroundColor: COLORS.white,
        borderRadius: 20,
        paddingBottom: 25,
    },
    modalHeader: {
        flexDirection: 'row-reverse',
        justifyContent: 'space-between',
    },
    closeWrapper: {
        width: 35,
        top: 10,
        right: 10,
        padding: 5,
        alignItems: 'center',
    },
    heading: {
        fontFamily: 'Inter-SemiBold',
        fontSize: 20,
        paddingVertical: 15,
        paddingHorizontal: 15,
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
        color: COLORS.greyTextDark,
    },
    subCategoryList: {
        marginHorizontal: 10,
        padding: 5,
    },
    subCategory: {
        marginHorizontal: 5,
        marginBottom: 12,
    },
    iconWrapper: {
        borderRadius: 12,
        height: 70,
        width: (width - 100) / 3,
        borderWidth: 1,
        borderColor: COLORS.primaryLightAlt,
        justifyContent: 'center',
        alignItems: 'center',
    },
    categoryIcon: {
        height: 40,
        width: 40,
        resizeMode: 'contain',
    },
    categoryName: {
        width: (width - 100) / 3,
        marginTop: 3,
        fontSize: 13,
        fontFamily: 'Inter-Medium',
        lineHeight: 16.94,
        color: COLORS.greyTextDark,
        textAlign: 'center',
    },
});
