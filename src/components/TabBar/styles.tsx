import {StyleSheet} from 'react-native';

import COLORS from 'utils/colors';

export default StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        alignItems: 'center',
        zIndex: 1,
        paddingTop: 8,
        borderColor: COLORS.white,
        borderTopWidth: 1,
    },
    containerHidden: {
        display: 'none',
    },
    tabBar: {
        flex: 1,
        alignItems: 'center',
    },
    title: {
        fontFamily: 'OpenSauceOne-Regular',
        color: COLORS.white,
        fontSize: 10,
        marginTop: 6,
    },
});
