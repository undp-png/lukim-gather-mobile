import {StyleSheet} from 'react-native';

import COLORS from 'utils/colors';

export default StyleSheet.create({
    container: {
        borderTopColor: COLORS.border,
        height: '100%',
        backgroundColor: '#E7ECF2',
        paddingHorizontal: 20,
        paddingTop: 110,
        paddingBottom: 80,
    },
    menuBar: {
        marginLeft: 20,
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
});
