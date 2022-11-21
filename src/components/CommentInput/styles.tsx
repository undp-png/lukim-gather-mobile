import {StyleSheet} from 'react-native';

import COLORS from 'utils/colors';

export default StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        width: '100%',
        zIndex: 1,
        backgroundColor: COLORS.white,
    },
    commentInput: {
        flex: 1,
    },
    sendIcon: {
        margin: 10,
    },
    input: {
        height: 56,
        marginTop: 8,
        paddingLeft: 12,
        paddingRight: 12,
        fontSize: 16,
        fontFamily: 'Inter-Regular',
        color: COLORS.tertiary,
        borderWidth: 1,
        borderRadius: 8,
        borderColor: COLORS.border,
    },
});
