import {StyleSheet} from 'react-native';

import COLORS from 'utils/colors';

export default StyleSheet.create({
    container: {
        flex: 1,
    },
    backgroundImage: {
        flex: 1,
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'space-between',
    },
    titleWrapper: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 75,
    },
    title: {
        fontSize: 24,
        fontFamily: 'Gilroy-Bold',
        color: COLORS.white,
        marginLeft: 10,
    },
    contentWrapper: {
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    contentTitle: {
        fontSize: 24,
        fontFamily: 'Inter-SemiBold',
        lineHeight: 29,
        color: COLORS.white,
        textAlign: 'center',
    },
    contentInfo: {
        maxWidth: 271,
        marginTop: 15,
        marginBottom: 10,
        fontSize: 16,
        fontFamily: 'Inter-Regular',
        lineHeight: 24,
        color: COLORS.white,
        textAlign: 'center',
    },
    dotsWrapper: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: 40,
        marginBottom: 15,
    },
    dot: {
        height: 12,
        width: 12,
        borderRadius: 5,
        backgroundColor: COLORS.white,
        marginHorizontal: 8,
    },
    buttonsWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
    },
    bottomSpacer: {
        marginBottom: 25,
    },
    link: {
        alignSelf: 'center',
        display: 'flex',
        paddingVertical: 10,
        textAlign: 'center',
    },
    linkText: {
        fontFamily: 'Inter-SemiBold',
        fontSize: 16,
        color: COLORS.white,
    },
    login: {
        width: '45%',
    },
    getStarted: {
        width: '45%',
    },
});
