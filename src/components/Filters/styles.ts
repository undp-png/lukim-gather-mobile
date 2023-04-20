import {StyleSheet} from 'react-native';

import COLORS from 'utils/colors';

export default StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    containerOpen: {
        height: 450,
    },
    pickerContainer: {
        width: '50%',
        position: 'relative',
        backgroundColor: '#fff',
        borderRadius: 8,
    },
    pickerContainerOpen: {
        backgroundColor: 'transparent',
    },
    pickerContainerAbsolute: {
        backgroundColor: 'transparent',
        width: '49%',
    },
    picker: {
        borderColor: COLORS.border,
        borderRadius: 0,
        height: 50,
    },
    pickerLeft: {
        borderTopLeftRadius: 8,
        borderBottomLeftRadius: 8,
    },
    pickerRight: {
        borderTopRightRadius: 8,
        borderBottomRightRadius: 8,
    },
    pickerAbsolute: {
        paddingHorizontal: 16,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
        elevation: 2,
    },
    dropdownContainer: {
        borderColor: COLORS.border,
        paddingBottom: 4,
    },
    dropdownContainerAbsolute: {
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
    },
    textStyle: {
        color: COLORS.greyTextDark,
        fontSize: 14,
        fontFamily: 'Inter-Medium',
    },
    labelStyle: {
        color: COLORS.greyTextDark,
        fontSize: 14,
        fontFamily: 'Inter-Medium',
    },
    searchContainer: {
        borderBottomColor: COLORS.border,
    },
    searchTextInput: {
        borderColor: COLORS.border,
    },
    label: {
        borderBottomWidth: 1,
        borderColor: COLORS.border,
    },
    projectListItemContainer: {
        height: 'auto',
        minHeight: 50,
        paddingVertical: 12,
    },
    itemSeparator: {
        backgroundColor: COLORS.border,
    },
    placeholder: {
        color: COLORS.inputText,
    },
});
