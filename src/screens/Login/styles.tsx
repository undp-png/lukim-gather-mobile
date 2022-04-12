import {StyleSheet} from 'react-native';

import COLORS from 'utils/colors';

export default StyleSheet.create({
    container: {
        height: '100%',
        paddingHorizontal: 20,
        backgroundColor: COLORS.white,
    },
    infoWrapper: {
        marginTop: 10,
        alignItems: 'flex-end',
    },
    info: {
        fontSize: 16,
        fontFamily: 'Inter-Medium',
        color: COLORS.blueText,
    },
    button: {
        marginTop: 32,
    },
    signUp: {
        marginTop: 30,
        alignItems: 'center',
    },
    text: {
        color: COLORS.blueTextAlt,
        fontSize: 14,
        fontFamily: 'Inter-Regular',
    },
});
