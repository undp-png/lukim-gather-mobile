import React, {useEffect} from 'react';
import {View, FlatList} from 'react-native';
import {useQuery} from '@apollo/client';

import MenuItem from 'components/MenuItem';
import {Loader} from 'components/Loader';

import {_} from 'services/i18n';
import {GET_SURVEY_FORMS} from 'services/gql/queries';
import {FormType} from '@generated/types';

import styles from './styles';

type KeyExtractor = (item: FormType, index: number) => string;
const keyExtractor: KeyExtractor = (item: FormType) => item.id.toString();

interface FormMenuItemProps {
    item: FormType;
}

const FormMenuItem: React.FC<FormMenuItemProps> = ({
    item,
}: FormMenuItemProps) => {
    return (
        <MenuItem title={item.title} linkTo="FillForm" params={{form: item}} />
    );
};

const Forms = () => {
    const {loading: fetching, data = {}, refetch} = useQuery(GET_SURVEY_FORMS);

    useEffect(() => {
        refetch();
    }, [refetch]);

    return (
        <View style={styles.container}>
            <View style={styles.menuWrapper}>
                <FlatList
                    data={data?.surveyForm ?? []}
                    renderItem={FormMenuItem}
                    keyExtractor={keyExtractor}
                    ListEmptyComponent={<Loader loading={fetching} />}
                />
            </View>
        </View>
    );
};

export default Forms;
