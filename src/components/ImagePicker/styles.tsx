import {StyleSheet} from 'react-native';

export default StyleSheet.create({
    options: {
        backgroundColor: 'white',
        flexDirection: 'row',
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        paddingTop: 15,
        paddingBottom: 25,
    },
    option: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modal: {
        justifyContent: 'flex-end',
        margin: 0,
    },
    icon: {
        marginHorizontal: 10,
    },
});
