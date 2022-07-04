import {StyleSheet} from 'react-native';
import COLORS from 'utils/colors';

export default StyleSheet.create({
    actionModal: {
        justifyContent: 'flex-end',
        margin: 0,
    },
    confirmModal: {
        margin: 0,
        justifyContent: 'center',
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
    cancelButton: {
        width: '47%',
    },
    confirmButton: {
        backgroundColor: COLORS.error,
        width: '47%',
    },
    options: {
        backgroundColor: COLORS.white,
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        padding: 20,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 7,
        marginBottom: 17,
    },
    icon: {
        height: 24,
        width: 24,
        resizeMode: 'contain',
    },
    title: {
        marginLeft: 12,
        fontSize: 16,
        lineHeight: 19,
        color: COLORS.tertiary,
        fontFamily: 'Inter-Medium',
    },
});
