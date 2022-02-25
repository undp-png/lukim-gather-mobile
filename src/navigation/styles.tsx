import {StyleSheet} from 'react-native';

import COLORS from 'utils/colors';

export default StyleSheet.create({
    tabBar: {
        backgroundColor: COLORS.white,
        minHeight: 70,
    },
    headerTitle: {
        color: COLORS.light,
        fontSize: 18,
    },
    header: {
        backgroundColor: COLORS.background,
    },
});
