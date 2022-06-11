import {StyleSheet} from 'react-native';

import COLORS from 'utils/colors';

export default StyleSheet.create({
    container: {
        borderTopColor: COLORS.border,
        borderTopWidth: 1,
        height: '100%',
        backgroundColor: '#E7ECF2',
        padding: 20,
        paddingBottom: 80,
    },
    searchBar: {
        marginLeft: 20,
        backgroundColor: COLORS.white,
        height: 40,
        width: 40,
        borderRadius: 20,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    menuBar: {
        marginRight: 20,
        backgroundColor: COLORS.white,
        borderRadius: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 7,
        paddingHorizontal: 10,
    },
    title: {
        marginLeft: 5,
        fontSize: 12,
        lineHeight: 16,
        fontFamily: 'Inter-Regular',
        color: COLORS.greyText,
    },
    searchWrapper: {
        marginBottom: 15,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E7ECF2',
        borderWidth: 1,
        borderColor: COLORS.primaryAlt,
        borderRadius: 8,
        paddingHorizontal: 10,
    },
    searchInput: {
        height: 40,
        fontFamily: 'Inter-Medium',
        color: COLORS.inputText,
    },
});
