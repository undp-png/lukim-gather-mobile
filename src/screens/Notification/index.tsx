import {formatDistanceToNow} from 'date-fns';
import React, {useCallback} from 'react';
import {FlatList, ListRenderItem, RefreshControl, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Icon} from 'react-native-eva-icons';
import {useLazyQuery, useMutation} from '@apollo/client';
import {useFocusEffect, useNavigation} from '@react-navigation/native';

import EmptyListMessage from 'components/EmptyListMessage';
import Text from 'components/Text';

import useQuery from 'hooks/useQuery';
import {
    GET_NOTIFICATIONS,
    GET_HAPPENING_SURVEY,
    MARK_AS_READ,
} from 'services/gql/queries';
import {NotificationType} from '@generated/types';

import cs from '@rna/utils/cs';

import COLORS from 'utils/colors';
import styles from './styles';

type IconType = {
    happening_survey_approved: string;
    happening_survey_rejected: string;
    default: string;
};

const icons: IconType = {
    happening_survey_approved: 'checkmark-outline',
    happening_survey_rejected: 'close-outline',
    default: 'file-text-outline',
};

type KeyExtractor = (item: NotificationType, index: number) => string;
const keyExtractor: KeyExtractor = item => item.id;

const Notifications = () => {
    const {loading, data, refetch} = useQuery(GET_NOTIFICATIONS);
    const [getHappeningSurvey] = useLazyQuery(GET_HAPPENING_SURVEY);
    const [markAsRead] = useMutation(MARK_AS_READ);
    const navigation = useNavigation();

    const handleRefresh = useCallback(() => {
        refetch();
    }, [refetch]);

    useFocusEffect(handleRefresh);

    const handleNotificationPress = useCallback(
        item => {
            markAsRead({variables: {id: Number(item.id)}});
            if (item?.notificationType.startsWith('happening_survey')) {
                getHappeningSurvey({
                    variables: {id: item.actionObjectObjectId.toString()},
                }).then(({data: surveyItem}) =>
                    navigation.navigate('SurveyItem', {
                        item: surveyItem?.happeningSurveys[0],
                    }),
                );
            }
        },
        [getHappeningSurvey, markAsRead, navigation],
    );

    const renderItem: ListRenderItem<NotificationType> = useCallback(
        ({item}: {item: NotificationType}) => (
            <TouchableOpacity
                onPress={() => handleNotificationPress(item)}
                style={cs(styles.notificationContainer, [
                    styles.notificationUnread,
                    !item.hasRead,
                ])}>
                <View style={styles.iconContainer}>
                    <Icon
                        name={
                            icons[item.notificationType as keyof IconType] ||
                            icons.default
                        }
                        height={30}
                        width={30}
                        fill={COLORS.white}
                    />
                </View>
                <View style={styles.notificationWrapper}>
                    <Text
                        style={styles.description}
                        title={item?.description}
                    />
                    <Text
                        style={styles.date}
                        title={formatDistanceToNow(new Date(item.createdAt))}
                    />
                </View>
            </TouchableOpacity>
        ),
        [handleNotificationPress],
    );
    return (
        <View style={styles.container}>
            <FlatList
                data={data?.notifications}
                keyExtractor={keyExtractor}
                ListEmptyComponent={loading ? null : EmptyListMessage}
                refreshControl={
                    <RefreshControl
                        refreshing={loading}
                        onRefresh={handleRefresh}
                    />
                }
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

export default Notifications;
