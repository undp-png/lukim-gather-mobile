import {StyleSheet} from 'react-native';

import COLORS from 'utils/colors';

export default StyleSheet.create({
    container: {
        height: '100%',
        backgroundColor: COLORS.white,
    },
    menuWrapper: {
        display: 'flex',
        padding: 20,
    },
    emptyText: {
        fontSize: 14,
        textAlign: 'center',
        fontFamily: 'Inter-Regular',
    },
});
