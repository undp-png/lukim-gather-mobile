import React, {useState, useCallback, useEffect} from 'react';
import {FlatList, View} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import type {RouteProp} from '@react-navigation/native';

import InputField from 'components/InputField';
import Map from 'components/Map';
import RadioInput from 'components/RadioInput';
import {SaveButton} from 'components/HeaderButton';

import {store} from 'store';
import {setLocation} from 'store/slices/survey';
import {StackParamList} from 'navigation';

import styles from './styles';

const {dispatch} = store;

const Labels = [
    {id: 1, label: 'Use my current location'},
    {id: 2, label: 'Set on a map'},
    {id: 3, label: 'Draw polygon'},
];

const keyExtractor = (item: {label: string}) => item.label;

type ChangeLocationScreenRouteProp = RouteProp<
    StackParamList,
    'ChangeLocation'
>;

const ChangeLocation = () => {
    const navigation = useNavigation();
    const {params = {}} = useRoute<ChangeLocationScreenRouteProp>();

    const [selectedMethod, setSelectedMethod] = useState<string>('');
    const [selectedCoordinate, setSelectedCoordinate] = useState<
        number[] | number[][]
    >([]);

    const handleSubmit = useCallback(() => {
        if (selectedMethod) {
            if (selectedMethod !== 'Draw polygon') {
                if (params.onChange) {
                    params.onChange({
                        point: selectedCoordinate,
                        polygon: null,
                    });
                    return navigation.goBack();
                }
                dispatch(
                    setLocation({
                        point: selectedCoordinate,
                        polygon: null,
                    }),
                );
            } else {
                if (params.onChange) {
                    params.onChange({
                        point: null,
                        polygon: [...selectedCoordinate, selectedCoordinate[0]],
                    });
                    return navigation.goBack();
                }
                dispatch(
                    setLocation({
                        point: null,
                        polygon: [...selectedCoordinate, selectedCoordinate[0]],
                    }),
                );
            }
        }
        navigation.goBack();
    }, [navigation, selectedCoordinate, selectedMethod, params]);

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => <SaveButton onSavePress={handleSubmit} />,
        });
    });

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

    const handleLocationPick = useCallback(coordinate => {
        setSelectedCoordinate(coordinate);
    }, []);

    return (
        <View style={styles.container}>
            <View>
                <InputField
                    placeholder="Place"
                    value={`${
                        selectedMethod === 'Draw polygon'
                            ? 'Boundary area'
                            : selectedMethod
                            ? selectedCoordinate
                            : ''
                    }`}
                    editable={false}
                />
                <FlatList
                    data={params.polygonDisabled ? Labels.slice(0, -1) : Labels}
                    renderItem={renderItem}
                    keyExtractor={keyExtractor}
                />
            </View>
            <View style={styles.mapContainer}>
                <Map
                    hideHeader
                    showMarker={selectedMethod === 'Set on a map'}
                    locationBarStyle={styles.locationBar}
                    onLocationPick={handleLocationPick}
                    pickLocation={selectedMethod}
                />
            </View>
        </View>
    );
};

export default ChangeLocation;
