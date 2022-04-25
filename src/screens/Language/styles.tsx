import {StyleSheet} from 'react-native';

import COLORS from 'utils/colors';

export default StyleSheet.create({
    container: {
        height: '100%',
        backgroundColor: COLORS.white,
        padding: 20,
    },
    option: {
        flexDirection: 'row',
        borderRadius: 8,
        alignItems: 'center',
        padding: 10,
        marginVertical: 5,
    },
    text: {
        fontFamily: 'Inter-Regular',
        color: '#404653',
        fontSize: 16,
        paddingVertical: 5,
        marginLeft: 14,
    },
});
