import {StyleSheet} from 'react-native';
import COLORS from 'utils/colors';

export default StyleSheet.create({
    modal: {
        margin: 0,
        flex: 1,
        backgroundColor: '#00000040',
    },
    boxContent: {
        width: '85%',
        alignSelf: 'center',
        backgroundColor: COLORS.white,
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 24,
    },
    checkWrapper: {
        marginTop: 8,
        flexDirection: 'row',
    },
    heading: {
        fontFamily: 'Inter-SemiBold',
        fontSize: 24,
        lineHeight: 29.05,
        color: COLORS.tertiary,
    },
    message: {
        marginHorizontal: 10,
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
    login: {
        width: '47%',
    },
    getStarted: {
        width: '47%',
    },
});
