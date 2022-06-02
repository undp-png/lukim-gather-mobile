import {StyleSheet} from 'react-native';
import COLORS from 'utils/colors';

export default StyleSheet.create({
    modal: {
        margin: 0,
        flex: 1,
        backgroundColor: '#10182870',
    },
    boxContent: {
        width: '85%',
        alignSelf: 'center',
        backgroundColor: COLORS.white,
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 24,
    },
    heading: {
        fontFamily: 'Inter-SemiBold',
        fontSize: 24,
        lineHeight: 29.05,
        color: COLORS.tertiary,
    },
    message: {
        marginTop: 8,
        fontFamily: 'Inter-Regular',
        fontSize: 16,
        lineHeight: 24,
        color: COLORS.tertiary,
    },
    buttonsWrapper: {
        marginTop: 24,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    buttonNegative: {
        borderColor: COLORS.error,
        marginBottom: 8,
    },
    buttonNegativeText: {
        color: COLORS.error,
    },
    buttonsRight: {
        flexDirection: 'row-reverse',
        flex: 1,
    },
    logoutButtonWrapper: {
        justifyContent: 'space-between',
    },
    logoutButton: {
        width: '47%',
        borderColor: '#F9D3BE',
    },
    buttonsRightVertical: {
        flexDirection: 'column',
    },
    buttonPositive: {
        marginLeft: 8,
        minWidth: '35%',
    },
    buttonPositiveVertical: {
        marginLeft: 0,
        marginBottom: 8,
    },
    cancel: {
        borderColor: COLORS.greyLight,
    },
    cancelText: {
        color: COLORS.greyLightAlt,
    },
    logoutText: {
        color: COLORS.accent,
    },
});
