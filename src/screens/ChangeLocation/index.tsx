import React, {useState, useCallback, useEffect, useMemo} from 'react';
import {FlatList, View} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import type {RouteProp} from '@react-navigation/native';
import Toast from 'react-native-simple-toast';

import InputField from 'components/InputField';
import Map from 'components/DrawableMap';
import RadioInput from 'components/RadioInput';
import {SaveButton} from 'components/HeaderButton';

import {_} from 'services/i18n';

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

    const [selectedCoordinate, setSelectedCoordinate] = useState<
        number[] | number[][]
    >([]);

    const [touched, setTouched] = useState(false);

    const initialData = useMemo(() => {
        if (params.surveyData) {
            return [params.surveyData];
        }
        return [];
    }, [params]);

    const [selectedMethod, setSelectedMethod] = useState<string | undefined>(
        params.surveyData ? undefined : 'Use my current location',
    );

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
                const polygonValue = [
                    ...selectedCoordinate,
                    selectedCoordinate[0],
                ];
                if (polygonValue.length < 4) {
                    return Toast.show(
                        _('Please add at least 3 points for the polygon!'),
                    );
                }
                if (params.onChange) {
                    params.onChange({
                        point: null,
                        polygon: polygonValue,
                    });
                    return navigation.goBack();
                }
                dispatch(
                    setLocation({
                        point: null,
                        polygon: polygonValue,
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
            setTouched(true);
            if (selectedMethod === label) {
                setTouched(false);
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
                    label={_(item.label)}
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
                    data={Labels}
                    renderItem={renderItem}
                    keyExtractor={keyExtractor}
                />
            </View>
            <View style={styles.mapContainer}>
                <Map
                    showCluster={!touched}
                    showMarker={selectedMethod === 'Set on a map'}
                    locationBarStyle={styles.locationBar}
                    onLocationPick={handleLocationPick}
                    pickLocation={selectedMethod}
                    surveyData={initialData}
                />
            </View>
        </View>
    );
};

export default ChangeLocation;
