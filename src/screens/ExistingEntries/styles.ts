import {StyleSheet} from 'react-native';

import COLORS from 'utils/colors';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
        padding: 16,
    },
    map: {
        borderRadius: 12,
        overflow: 'hidden',
    },
    locationBar: {
        bottom: 20,
    },
});
