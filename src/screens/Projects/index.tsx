import React, {useCallback, useMemo} from 'react';
import {View} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';

import Accordion from 'components/Accordion';

import {GET_USER_PROJECTS} from 'services/gql/queries';
import useQuery from 'hooks/useQuery';

import {ProjectType} from '@generated/types';

import styles from './styles';

const keyExtractor = (item: ProjectType) => String(item.id);

const Projects = () => {
    const {data} = useQuery<{
        me: {projects: ProjectType[]};
    }>(GET_USER_PROJECTS);

    const renderItems = useCallback(({item}: {item: ProjectType}) => {
        return <Accordion item={item} />;
    }, []);

    const projects = useMemo(() => {
        return (data?.me?.projects || []) as ProjectType[];
    }, [data]);

    return (
        <View style={styles.container}>
            <FlatList
                data={projects}
                renderItem={renderItems}
                keyExtractor={keyExtractor}
            />
        </View>
    );
};

export default Projects;
