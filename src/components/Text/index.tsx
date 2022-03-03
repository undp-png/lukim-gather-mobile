import React from 'react';
import {Text} from 'react-native';

const _Text = ({title, ...textProps}) => {
    return <Text {...textProps}>{title}</Text>;
};

export default _Text;
