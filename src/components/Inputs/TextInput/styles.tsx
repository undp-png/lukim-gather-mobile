import {StyleSheet} from 'react-native';

import COLORS from 'utils/colors';

export default StyleSheet.create({
    inputWarning: {
        borderColor: COLORS.warning,
    },
    inputError: {
        borderColor: COLORS.error,
    },
    errorText: {
        color: COLORS.error,
    },
    warningText: {
        color: COLORS.warning,
    },
});
