import {StyleSheet} from 'react-native';

import COLORS from 'utils/colors';

export default StyleSheet.create({
    container: {
        borderTopColor: COLORS.border,
        borderTopWidth: 1,
        height: '100%',
        backgroundColor: '#E7ECF2',
        padding: 20,
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
        height: 40,
        borderRadius: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 12,
    },
    title: {
        marginLeft: 5,
        fontSize: 12,
        lineHeight: 16,
        fontFamily: 'Inter-Regular',
        color: COLORS.tertiaryAlt,
    },
});
