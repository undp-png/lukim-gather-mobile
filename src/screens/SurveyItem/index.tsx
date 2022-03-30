import React, {useEffect, useCallback} from 'react';
import {View, Image} from 'react-native';
import {FlatList, ScrollView} from 'react-native-gesture-handler';
import {useNavigation, useRoute} from '@react-navigation/native';

import Text from 'components/Text';
import {OptionIcon} from 'components/HeaderButton';

import {_} from 'services/i18n';

import styles from './styles';

const Header = ({title}: {title: string}) => {
    return (
        <View style={styles.header}>
            <Text style={styles.headerTitle} title={title} />
        </View>
    );
};

const Photos = ({photos}: {photos: {image: string}[]}) => {
    const renderItem = useCallback(
        ({item}: {item: {image: string}}) => (
            <Image
                source={
                    {uri: item.image} ||
                    require('assets/images/category-placeholder.png')
                }
                style={styles.surveyImage}
            />
        ),
        [],
    );
    return (
        <FlatList
            data={photos}
            renderItem={renderItem}
            horizontal
            showsHorizontalScrollIndicator={false}
        />
    );
};

const SurveyItem = () => {
    const route = useRoute();
    const item = {title: '2020 PNG Trees Study', icon: ''};
    const navigation = useNavigation();
    useEffect(() => {
        navigation.setOptions({
            headerRight: () => <OptionIcon onOptionPress={() => {}} />,
        });
    });
    const surveyData = route?.params?.item;
    return (
        <ScrollView
            style={styles.container}
            showsVerticalScrollIndicator={false}>
            <View style={styles.category}>
                <Image
                    source={
                        item.icon ||
                        require('assets/images/category-placeholder.png')
                    }
                    style={styles.categoryIcon}
                />
                <Text style={styles.field} title={surveyData.category.title} />
            </View>
            <Header title="Name" />
            <View style={styles.content}>
                <Text style={styles.name} title={surveyData.title} />
            </View>
            <Header title="Photos" />
            <View style={styles.photosWrapper}>
                <Photos photos={surveyData?.images} />
            </View>
            <Header title="Feels" />
            <View style={styles.content}>
                <View style={styles.feeelWrapper}>
                    <Text style={styles.feelIcon} title={surveyData.feel} />
                </View>
            </View>
            <Header title="Description" />
            <View style={styles.content}>
                <Text
                    style={styles.description}
                    title={surveyData.description}
                />
            </View>
        </ScrollView>
    );
};

export default SurveyItem;
