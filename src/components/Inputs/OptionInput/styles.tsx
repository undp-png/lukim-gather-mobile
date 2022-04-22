import {StyleSheet, Dimensions} from 'react-native';

import COLORS from 'utils/colors';

const {width} = Dimensions.get('screen');

export default StyleSheet.create({
    container: {
        marginBottom: 8,
    },
    title: {
        fontSize: 16,
        fontFamily: 'Inter-Medium',
        color: COLORS.inputText,
    },
    dropdownMenu: {
        height: 56,
        marginTop: 8,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderRadius: 8,
        borderColor: COLORS.border,
    },
    dropdownMenuInner: {
        borderBottomWidth: 0,
        paddingRight: 0,
    },
    dropdownList: {
        backgroundColor: COLORS.white,
    },
    dropdownText: {
        color: COLORS.background,
    },
    dropdownTextSelected: {
        color: COLORS.tertiary,
    },
    selectorContainer: {
        marginTop: 8,
        borderColor: COLORS.border,
        borderWidth: 1,
        padding: 4,
    },
    rowItem: {
        paddingVertical: 4,
    },
    tagContainer: {
        width: width - 50,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 8,
        backgroundColor: COLORS.primaryLightAlt,
    },
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
