import {StyleSheet, Platform} from 'react-native';

import COLORS from 'utils/colors';

export default StyleSheet.create({
    container: {
        borderTopWidth: 10,
        borderTopColor: '#fff',
        height: '100%',
        backgroundColor: '#E7ECF2',
        padding: 20,
    },
    searchWrapper: {
        marginRight: -25,
        marginLeft: Platform.OS === 'ios' ? -30 : 0,
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
    message: {
        color: COLORS.greyTextDark,
        fontFamily: 'Inter-Medium',
        textAlign: 'center',
    },
});
