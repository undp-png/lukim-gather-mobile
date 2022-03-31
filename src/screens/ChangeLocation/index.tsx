import React, {useState, useCallback} from 'react';
import {FlatList, SafeAreaView, View} from 'react-native';

import InputField from 'components/InputField';
import RadioInput from 'components/RadioInput';
import Map from 'components/Map';

import styles from './styles';

const Labels = [
    {id: 1, label: 'Use my current location'},
    {id: 2, label: 'Set on a map'},
    {id: 3, label: 'Draw polygon'},
];

const keyExtractor = (item: {label: string}) => item.label;

const ChangeLocation = () => {
    const [selectedMethod, setSelectedMethod] = useState('');
    const handleSelectedMethod = useCallback(
        (label: string) => {
            if (selectedMethod === label) {
                setSelectedMethod('');
            } else {
                setSelectedMethod(label);
            }
        },
        [selectedMethod],
    );

    const renderItem = useCallback(
        ({item}) => {
            return (
                <RadioInput
                    label={item.label}
                    onPress={handleSelectedMethod}
                    selected={selectedMethod === item.label}
                />
            );
        },
        [handleSelectedMethod, selectedMethod],
    );

    return (
        <SafeAreaView style={styles.container}>
            <View>
                <InputField searchInput placeholder="ABC County" />
                <FlatList
                    data={Labels}
                    renderItem={renderItem}
                    keyExtractor={keyExtractor}
                />
            </View>
            <View style={styles.mapContainer}>
                <Map
                    hideHeader
                    showMarker={selectedMethod === 'Set on a map'}
                    locationBarStyle={styles.locationBar}
                />
            </View>
        </SafeAreaView>
    );
};

export default ChangeLocation;
