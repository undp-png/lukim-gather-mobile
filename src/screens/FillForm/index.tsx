import React, {useState, useMemo, useCallback, useRef} from 'react';
import {View, Text} from 'react-native';
import {RootStateOrAny, useSelector, useDispatch} from 'react-redux';
import {useRoute, useNavigation} from '@react-navigation/native';
import {KeyboardAwareFlatList} from 'react-native-keyboard-aware-scroll-view';
import {reset, Field} from 'redux-form';
import Toast from 'react-native-simple-toast';
import {useMutation} from '@apollo/client';
import uuid from 'react-native-uuid';

import {
    FormType,
    QuestionGroupType,
    QuestionType,
    CreateWritableSurveyMutation,
    CreateWritableSurveyMutationVariables,
} from '@generated/types';

import withReduxForm, {ReduxFormProps} from 'components/WithReduxForm';
import Button from 'components/Button';
import {ModalLoader} from 'components/Loader';
import TextInput from 'components/Inputs/TextInput';

import {CREATE_WRITABLE_SURVEY} from 'services/gql/queries';
import {_} from 'services/i18n';
import {getErrorMessage} from 'utils/error';

import Question, {requiredValidator} from './Question';

import styles from './styles';

type CodeExtractor = (item: QuestionType) => string;
const codeExtractor: CodeExtractor = item => item.code;

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
    isViewOnly?: boolean | undefined;
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
        isViewOnly,
    } = props;

    return (
        <KeyboardAwareFlatList
            data={questionList}
            renderItem={listProps => (
                <Question
                    {...listProps}
                    showRequired={showRequired}
                    editable={!isViewOnly}
                />
            )}
            keyExtractor={codeExtractor}
            removeClippedSubviews={false}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
                <View>
                    {!showPrevious && (
                        <Field
                            name="surveyTitle"
                            component={TextInput}
                            props={{
                                fieldContainerStyle:
                                    styles.surveyTitleContainer,
                                containerStyle: styles.surveyTitle,
                                title: _(
                                    'Please enter a title for this survey',
                                ),
                                showRequired,
                            }}
                            format={null}
                            inputProps={{editable: !isViewOnly}}
                            validate={[requiredValidator]}
                        />
                    )}
                    <View style={styles.groupTitleContainer}>
                        <Text style={styles.groupTitle}>
                            {activeGroup?.title}
                        </Text>
                    </View>
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

let Form: React.FC<ReduxFormProps> = (props: ReduxFormProps) => {
    const {formName, isViewOnlyMode, questionGroups} = props;

    const [activeGroupIndex, setActiveGroupIndex] = useState(0);
    const [showRequired, setRequiredVisibility] = useState(false);

    const navigation = useNavigation();

    const dispatch = useDispatch();

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
            ) &&
            formState.values.surveyTitle
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

    const allQuestions: QuestionType[] = useMemo(
        () =>
            questionGroups?.reduce(
                (
                    prevValue: QuestionType[],
                    currentValue: QuestionGroupType,
                ) => {
                    return [...prevValue, ...currentValue.questions];
                },
                [],
            ) ?? [],
        [questionGroups],
    );

    const [createWritableSurvey, {loading}] = useMutation<
        CreateWritableSurveyMutation,
        CreateWritableSurveyMutationVariables
    >(CREATE_WRITABLE_SURVEY, {
        onError: err => {
            Toast.show(getErrorMessage(err), Toast.LONG, [
                'RCTModalHostViewController',
            ]);
        },
    });

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
        const formAnswers = Object.entries(formState.values)
            .filter(([quesCode]) => quesCode !== 'surveyTitle')
            .map(([quesCode, answer]) => {
                const currentQuestion = allQuestions.find(
                    (ques: QuestionType) => ques.code === quesCode,
                );
                if (
                    currentQuestion?.answerType === 'SINGLE_OPTION' ||
                    currentQuestion?.answerType === 'MULTIPLE_OPTION'
                ) {
                    return {
                        question: currentQuestion?.id,
                        options: answer,
                        answerType: currentQuestion?.answerType,
                    };
                }
                return {
                    question: currentQuestion?.id,
                    answer,
                    answerType: currentQuestion?.answerType,
                };
            });
        const surveyTitle = formState.values.surveyTitle;
        const {data, errors} = await createWritableSurvey({
            variables: {
                input: {title: surveyTitle, answers: formAnswers},
            },
            optimisticResponse: {
                createWritableSurvey: {
                    __typename: 'WritableSurveyType',
                    errors: [],
                    ok: null,
                    id: uuid.v4(),
                    title: surveyTitle,
                },
            },
        });
        if (
            (errors && errors?.length > 0) ||
            data?.createWritableSurvey?.errors?.length > 0
        ) {
            return Toast.show(
                _('There was an error during submission'),
                Toast.LONG,
                ['RCTModalHostViewController'],
            );
        }
        if (!data?.createWritableSurvey?.id) {
            return;
        }
        Toast.show(
            _('Survey form has been submitted successfully!'),
            Toast.LONG,
            ['RCTModalHostViewController'],
        );
        dispatch(reset(formName));
        navigation.goBack();
    }, [
        formState,
        isNextDisabled,
        hasErrors,
        allQuestions,
        createWritableSurvey,
        dispatch,
        navigation,
        formName,
    ]);

    return (
        <View style={styles.container}>
            <ModalLoader loading={loading} />
            <GroupContent
                activeGroup={activeGroup}
                questions={activeQuestions}
                showPrevious={activeGroupIndex !== 0}
                showNext={activeGroupIndex !== questionGroups.length - 1}
                showSubmit={
                    !isViewOnlyMode &&
                    activeGroupIndex === questionGroups.length - 1
                }
                onPreviousPress={handlePreviousPress}
                onNextPress={handleNextPress}
                onSubmitPress={handleSubmit}
                showRequired={showRequired}
                isViewOnly={isViewOnlyMode}
            />
        </View>
    );
};

const ReduxForm = withReduxForm(Form);

interface RouteParams {
    params: {
        form: FormType;
        isViewOnlyMode?: boolean;
    };
    name: string;
    path?: string | undefined;
    key: string;
}

const FillForm: React.FC = () => {
    const {params} = useRoute<RouteParams>();

    return (
        <ReduxForm
            form={params.form}
            isViewOnlyMode={params.isViewOnlyMode}
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
