import {StyleSheet} from 'react-native';

import COLORS from 'utils/colors';

export default StyleSheet.create({
    actionModal: {
        justifyContent: 'flex-end',
        margin: 0,
        flexDirection: 'column',
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        paddingHorizontal: 4,
    },
    inputContainer: {
        flex: 1,
        padding: 8,
    },
    input: {
        height: 'auto',
    },
    icon: {
        marginTop: 30,
        marginRight: 10,
    },
});
