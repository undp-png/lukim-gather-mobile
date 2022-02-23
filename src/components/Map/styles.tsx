import {StyleSheet} from 'react-native';

import COLORS from 'utils/colors';

export default StyleSheet.create({
    page: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.background,
        height: '100%',
        width: '100%',
    },
    container: {
        height: '100%',
        width: '100%',
        backgroundColor: COLORS.background,
    },
    map: {
        flex: 1,
    },
});
