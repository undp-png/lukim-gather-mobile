import {StyleSheet} from 'react-native';

import COLORS from 'utils/colors';

export default StyleSheet.create({
    container: {
        height: '100%',
        backgroundColor: COLORS.white,
        paddingHorizontal: 20,
    },
    infoText: {
        color: COLORS.inputText,
        marginTop: 8,
        fontFamily: 'Inter-Regular',
    },
});
