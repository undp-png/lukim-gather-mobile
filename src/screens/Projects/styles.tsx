import {StyleSheet} from 'react-native';

import COLORS from 'utils/colors';

export default StyleSheet.create({
    container: {
        height: '100%',
        padding: 20,
        backgroundColor: COLORS.white,
    },
    text: {
        color: COLORS.greyTextDark,
        fontSize: 14,
        fontFamily: 'Inter-Regular',
        textAlign: 'center',
    },
    loader: {
        top: '10%',
    },
});
