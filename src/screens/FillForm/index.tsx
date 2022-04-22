import React, {useState, useMemo, useCallback, useEffect} from 'react';
import {View, Text} from 'react-native';
import {RootStateOrAny, useSelector, useDispatch} from 'react-redux';
import {useRoute, useNavigation} from '@react-navigation/native';
import {KeyboardAwareFlatList} from 'react-native-keyboard-aware-scroll-view';
import {formValues, reset} from 'redux-form';
import Toast from 'react-native-simple-toast';
import {useNetInfo} from '@react-native-community/netinfo';
import {gql, useQuery} from '@apollo/client';

import withReduxForm from 'components/WithReduxForm';
import Button from 'components/Button';
import {ModalLoader, Loader} from 'components/Loader';

import {_} from 'services/i18n';
import {GET_QUESTION_GROUPS} from 'services/gql/queries';
import {isset} from '@rna/utils';

import Question, {QuestionType} from './Question';

import styles from './styles';

const codeExtractor = (item: QuestionType) => item.code;

interface QuestionGroupType {
    id: number;
    code?: string;
    title: string;
    skipLogic?: string;
    questions?: QuestionType[];
}

interface GroupContentProps {
    activeGroup?: QuestionGroupType;
    questions?: QuestionType[];
    showPrevious: boolean;
    showNext: boolean;
    showSubmit: boolean;
    onPreviousPress?: () => void;
    onNextPress?: () => void;
    onSubmitPress?: () => void;
    showRequired?: boolean | undefined;
}

interface FormProps {
    formName: string;
    formConfig: {
        destroyOnUnmount?: boolean;
        enableReinitialize?: boolean;
        shouldAsyncValidate?: () => boolean;
        touchOnChange?: boolean;
        [key: string]: any;
    };
}

const GroupContent: React.FC<GroupContentProps> = (
    props: GroupContentProps,
) => {
    const {
        activeGroup,
        questions: questionList,
        showPrevious,
        showNext,
        showSubmit,
        onPreviousPress,
        onNextPress,
        onSubmitPress,
        showRequired,
    } = props;

    return (
        <KeyboardAwareFlatList
            data={questionList}
            renderItem={listProps => (
                <Question {...listProps} showRequired={showRequired} />
            )}
            keyExtractor={codeExtractor}
            removeClippedSubviews={false}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
                <View style={styles.groupTitleContainer}>
                    <Text style={styles.groupTitle}>{activeGroup?.title}</Text>
                </View>
            }
            ListFooterComponent={
                <View style={styles.buttonsContainer}>
                    {showPrevious && (
                        <Button
                            title={_('Previous')}
                            onPress={onPreviousPress}
                        />
                    )}
                    {showNext ? (
                        <Button
                            style={styles.nextButton}
                            title={_('Next')}
                            onPress={onNextPress}
                        />
                    ) : (
                        showSubmit && (
                            <Button
                                style={styles.nextButton}
                                title={_('Submit')}
                                onPress={onSubmitPress}
                            />
                        )
                    )}
                </View>
            }
        />
    );
};

let Form: React.FC<FormProps> = (props: FormProps) => {
    const {formName} = props;

    const [activeGroupIndex, setActiveGroupIndex] = useState(0);
    const [showRequired, setRequiredVisibility] = useState(false);
    const [loading, setLoading] = useState(false);

    const {
        loading: fetching,
        data = {},
        refetch,
    } = useQuery(GET_QUESTION_GROUPS);

    const questionGroups = useMemo(() => data.questionGroup ?? [], [data]);

    const navigation = useNavigation();

    const dispatch = useDispatch();

    const netInfo = useNetInfo();
    useEffect(() => {
        netInfo.isInternetReachable && refetch();
    }, [refetch, netInfo.isInternetReachable]);

    const formStore = useSelector((state: RootStateOrAny) => state.form);
    const formState = formStore?.[formName];

    const activeGroup = useMemo(
        () => questionGroups[activeGroupIndex],
        [activeGroupIndex, questionGroups],
    );

    const activeQuestions = useMemo(
        () => activeGroup?.questions ?? [],
        [activeGroup],
    );

    const isNextDisabled = useMemo(() => {
        const requiredQuestions = activeQuestions?.filter(
            (q: QuestionType) => q.isRequired && q.answerType !== 'DESCRIPTION',
        );
        if (
            formState?.values &&
            requiredQuestions.every((ques: QuestionType) =>
                Object.keys(formState.values).includes(ques.code),
            )
        ) {
            return false;
        }
        return true;
    }, [activeQuestions, formState]);

    const hasErrors = useMemo(() => {
        if (!formState?.syncErrors) {
            return false;
        }
        return activeQuestions?.some((ques: QuestionType) =>
            Object.keys(formState.syncErrors).includes(ques.code),
        );
    }, [formState, activeQuestions]);

    const handlePreviousPress = useCallback(() => {
        setActiveGroupIndex(activeGroupIndex - 1);
    }, [activeGroupIndex]);

    const handleNextPress = useCallback(() => {
        if (isNextDisabled) {
            Toast.show(
                _('Please fill up the required fields before proceeding!'),
            );
            return setRequiredVisibility(true);
        }
        if (hasErrors) {
            return Toast.show(_('Please fix all errors before proceeding!'));
        }
        setRequiredVisibility(false);
        setActiveGroupIndex(activeGroupIndex + 1);
    }, [activeGroupIndex, isNextDisabled, hasErrors]);

    const handleSubmit = useCallback(async () => {
        if (isNextDisabled || hasErrors) {
            Toast.show(_('Please correctly fill the entire form to submit!'));
            return setRequiredVisibility(true);
        }
        const submission = {
            uuid: 'abcd',
            form: formName,
            formData: formState.values,
        };
        dispatch(reset(formName));
        if (netInfo.isInternetReachable) {
            setLoading(true);
            //TODO: Submit
            return setTimeout(() => {
                Toast.show(_('The form has been successfully submitted!'));
                setLoading(false);
                return navigation.goBack();
            }, 2000);
        }
        Toast.show(
            _(
                'The form has been saved, and will be submitted when your device goes online',
            ),
        );
        navigation.goBack();
    }, [
        formState,
        isNextDisabled,
        hasErrors,
        dispatch,
        formName,
        netInfo,
        navigation,
    ]);

    return (
        <View style={styles.container}>
            <ModalLoader loading={loading} />
            {fetching ? (
                <Loader loading />
            ) : (
                <GroupContent
                    activeGroup={activeGroup}
                    questions={activeQuestions}
                    showPrevious={activeGroupIndex !== 0}
                    showNext={activeGroupIndex !== questionGroups.length - 1}
                    showSubmit={activeGroupIndex === questionGroups.length - 1}
                    onPreviousPress={handlePreviousPress}
                    onNextPress={handleNextPress}
                    onSubmitPress={handleSubmit}
                    showRequired={showRequired}
                />
            )}
        </View>
    );
};

Form = withReduxForm(Form);

interface RouteParams {
    params: {
        form: {
            title: string;
        };
    };
    name: string;
    path?: string | undefined;
    key: string;
}

const FillForm: React.FC = () => {
    const {params} = useRoute<RouteParams>();

    return (
        <Form
            formName={params.form.title}
            formConfig={{
                destroyOnUnmount: false,
                enableReinitialize: true,
                shouldAsyncValidate: () => false,
                touchOnChange: true,
            }}
        />
    );
};

export default FillForm;
