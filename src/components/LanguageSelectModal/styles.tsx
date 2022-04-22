import {StyleSheet} from 'react-native';

import COLORS from 'utils/colors';

export default StyleSheet.create({
    modal: {
        margin: 0,
        flex: 1,
        backgroundColor: '#00000040',
    },
    options: {
        width: '85%',
        alignSelf: 'center',
        backgroundColor: COLORS.white,
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 24,
    },
    option: {
        flexDirection: 'row',
        borderRadius: 8,
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        marginVertical: 5,
        backgroundColor: COLORS.blueText,
    },
    text: {
        color: COLORS.white,
        fontSize: 16,
        paddingVertical: 5,
    },
});
