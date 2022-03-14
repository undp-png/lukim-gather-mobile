import {StyleSheet} from 'react-native';

import COLORS from 'utils/colors';

export default StyleSheet.create({
    container: {
        marginTop: 25,
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    textInput: {
        width: 48,
        height: 48,
        fontSize: 23,
        borderWidth: 1,
        borderRadius: 8,
        color: COLORS.tertiary,
        paddingHorizontal: 10,
        textAlign: 'center',
    },
});
