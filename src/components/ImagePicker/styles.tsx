import {StyleSheet} from 'react-native';

export default StyleSheet.create({
    options: {
        backgroundColor: 'white',
        flexDirection: 'row',
        borderTopRightRadius: 30,
        borderTopLeftRadius: 30,
        paddingVertical: 20,
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
