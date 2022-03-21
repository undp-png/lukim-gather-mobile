import {Dimensions, StyleSheet} from 'react-native';

const {width} = Dimensions.get('window');

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
        backgroundColor: '#000000c0',
    },
    titleWrapper: {
        marginTop: 75,
    },
    title: {
        fontSize: 32,
        fontFamily: 'Gilroy-Bold',
        color: '#6DE58C',
        textAlign: 'center',
    },
    flatListWrapper: {
        flex: 1,
    },
    contentWrapper: {
        width: width,
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
        marginTop: 20,
        marginBottom: 10,
        fontSize: 16,
        fontFamily: 'Inter-Regular',
        lineHeight: 24,
        color: '#AEAEAE',
        textAlign: 'center',
    },
    dotsWrapper: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: 40,
    },
    dot: {
        height: 10,
        width: 10,
        borderRadius: 5,
        backgroundColor: COLORS.white,
        marginHorizontal: 8,
    },
    buttonsWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 50,
        marginTop: 70,
    },
    login: {
        width: '45%',
    },
    getStarted: {
        width: '45%',
    },
});
