import {StyleSheet} from 'react-native';

import COLORS from 'utils/colors';

export default StyleSheet.create({
    addImages: {
        height: 122,
        flexDirection: 'row',
    },
    imgPickerWrapper: {
        height: '100%',
        justifyContent: 'center',
    },
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
        backgroundColor: '#10182870',
    },
    icon: {
        marginHorizontal: 10,
    },
    surveyImageWrapper: {
        position: 'relative',
    },
    surveyImage: {
        borderRadius: 8,
        height: 122,
        width: 162,
        resizeMode: 'cover',
        backgroundColor: '#ffc',
        marginRight: 10,
    },
    closeIcon: {
        position: 'absolute',
        right: 18,
        top: 8,
        backgroundColor: 'rgba(0,0,0,0.4)',
        borderRadius: 20,
    },
    optionText: {
        color: COLORS.greyTextDark,
    },
});
