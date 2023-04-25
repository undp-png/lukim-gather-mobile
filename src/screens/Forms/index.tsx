import React, {useEffect, useCallback, useMemo, useState} from 'react';
import {View, FlatList, Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {RootStateOrAny, useSelector, useDispatch} from 'react-redux';

import MenuItem from 'components/MenuItem';
import {Loader} from 'components/Loader';
import {ConfirmBox} from 'components/ConfirmationBox';

import {_} from 'services/i18n';
import useQuery from 'hooks/useQuery';
import {GET_SURVEY_FORMS, GET_USER_PROJECTS} from 'services/gql/queries';
import {FormType} from '@generated/types';

import type {StackNavigationProp} from '@react-navigation/stack';
import type {StackParamList} from 'navigation';

import {resetForm} from 'store/slices/form';

import styles from './styles';

import type {ProjectType} from '@generated/types';

type KeyExtractor = (item: FormType, index: number) => string;
const keyExtractor: KeyExtractor = (item: FormType) => item.id.toString();

interface FormMenuItemProps {
    item: FormType;
    projects: ProjectType[];
}

const FormMenuItem: React.FC<FormMenuItemProps> = ({
    item,
    projects,
}: FormMenuItemProps) => {
    const navigation = useNavigation<StackNavigationProp<StackParamList>>();
    const dispatch = useDispatch();

    const [isResumeModalVisible, setResumeModalVisibility] = useState(false);

    const handleHideResumeModal = useCallback(
        () => setResumeModalVisibility(false),
        [],
    );

    const formState = useSelector((state: RootStateOrAny) => state.form);

    const FORM_KEY = useMemo(() => {
        return `survey_data__${item.id}`;
    }, [item]);

    const goToForm = useCallback(() => {
        setResumeModalVisibility(false);
        dispatch(resetForm(FORM_KEY));
        navigation.navigate('WebViewForm', {form: item, projects: projects});
    }, [navigation, item, dispatch, FORM_KEY, projects]);

    const goToFormWithData = useCallback(() => {
        setResumeModalVisibility(false);
        navigation.navigate('WebViewForm', {
            form: item,
            data: formState[FORM_KEY],
            projects: projects,
        });
    }, [item, navigation, formState, FORM_KEY, projects]);

    const handleNoResumePress = useCallback(() => {
        Alert.alert(
            _('Are you sure you want to start over?'),
            _(
                'All previously filled values will be lost, and you will have to fill the form from scratch.',
            ),
            [
                {
                    text: _('No'),
                    style: 'cancel',
                },
                {
                    text: _('Yes'),
                    style: 'default',
                    onPress: goToForm,
                },
            ],
            {
                cancelable: true,
            },
        );
    }, [goToForm]);

    const handleFormPress = useCallback(async () => {
        const formData = formState[FORM_KEY]?.data;
        if (formData?.length) {
            return setResumeModalVisibility(true);
        }
        goToForm();
    }, [FORM_KEY, goToForm, formState]);

    return (
        <>
            <ConfirmBox
                headerText={_('Resume with previous values?')}
                descriptionText={_(
                    'You have previously filled values for this form. Do you want to resume using these values?',
                )}
                isOpen={isResumeModalVisible}
                onCancel={handleHideResumeModal}
                negativeText={_('Delete, and continue')}
                onNegative={handleNoResumePress}
                positiveText={_('Resume, and continue')}
                onPositive={goToFormWithData}
                vertical
            />
            <MenuItem title={item.title} onPress={handleFormPress} />
        </>
    );
};

const Forms = () => {
    const {loading: fetching, data = {}, refetch} = useQuery(GET_SURVEY_FORMS);

    const res = useQuery<{
        me: {projects: ProjectType[]};
    }>(GET_USER_PROJECTS);

    const projects = useMemo(() => {
        return (res.data?.me?.projects || []) as ProjectType[];
    }, [res.data]);

    useEffect(() => {
        refetch();
    }, [refetch]);

    const renderFormMenuItem = useCallback(
        listProps => <FormMenuItem {...listProps} projects={projects} />,
        [projects],
    );

    return (
        <View style={styles.container}>
            <View style={styles.menuWrapper}>
                <FlatList
                    data={data?.surveyForm ?? []}
                    renderItem={renderFormMenuItem}
                    keyExtractor={keyExtractor}
                    ListEmptyComponent={<Loader loading={fetching} />}
                />
            </View>
        </View>
    );
};

export default Forms;
