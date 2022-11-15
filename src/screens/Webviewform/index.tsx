import React, {useEffect, useState, useMemo, useCallback} from 'react';
import {Platform} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector, RootStateOrAny} from 'react-redux';

import {WebView} from 'react-native-webview';
import StaticServer from 'react-native-static-server';
import RNFS from 'react-native-fs';
import Toast from 'react-native-simple-toast';
import {useMutation} from '@apollo/client';
import uuid from 'react-native-uuid';
import {XMLParser} from 'fast-xml-parser';

import {setFormData, setFormMedia, resetForm} from 'store/slices/form';

import {Loader} from 'components/Loader';
import {_} from 'services/i18n';

import {
    FormType,
    CreateWritableSurveyMutation,
    CreateWritableSurveyMutationVariables,
} from '@generated/types';
import {CREATE_WRITABLE_SURVEY} from 'services/gql/queries';
import {getErrorMessage} from 'utils/error';

export type FormDataType = {
    data?: string;
    media?: string;
};

interface RouteParams {
    params: {
        form: FormType;
        data?: FormDataType;
    };
    name: string;
    path?: string | undefined;
    key: string;
}

const WebViewForm: React.FC = () => {
    const {
        params: {form: formObj, data: formData},
    } = useRoute<RouteParams>();

    const dispatch = useDispatch();
    const formState = useSelector((state: RootStateOrAny) => state.form);

    const navigation = useNavigation();
    const [uri, setUri] = useState<string | undefined>();
    const [processing, setProcessing] = useState<boolean>(false);

    const FORM_KEY = useMemo(() => `survey_data__${formObj.id}`, [formObj]);

    const initializeData = useMemo(() => {
        let model = formObj.xform.model;
        const form = formObj.xform.form;

        if (formData?.data?.length) {
            model = model.replace(/<data(.*?)<\/data>/, formData.data);
        }

        return `
            window._formStr = \`${form}\`;
            window._modelStr = \`${model}\`;
            true;
        `;
    }, [formObj, formData]);

    const [createWritableSurvey, {loading}] = useMutation<
        CreateWritableSurveyMutation,
        CreateWritableSurveyMutationVariables
    >(CREATE_WRITABLE_SURVEY, {
        onCompleted: () => {
            Toast.show(_('Survey has been created successfully!'), Toast.LONG, [
                'RCTModalHostViewController',
            ]);
            setProcessing(loading);
        },
        onError: err => {
            Toast.show(getErrorMessage(err), Toast.LONG, [
                'RCTModalHostViewController',
            ]);
            setProcessing(loading);
            console.log('[Create Survey Error]: ', err);
        },
    });

    useEffect((): any => {
        let server: StaticServer;
        const startServer = async () => {
            if (Platform.OS === 'android') {
                const exists = await RNFS.exists(
                    RNFS.DocumentDirectoryPath + '/custom',
                );
                if (__DEV__ || !exists) {
                    await RNFS.mkdir(RNFS.DocumentDirectoryPath + '/custom');

                    const assetfiles = await RNFS.readDirAssets('custom');
                    for (const file of assetfiles) {
                        await RNFS.copyFileAssets(
                            file.path,
                            `${RNFS.DocumentDirectoryPath}/${file.path}`,
                        );
                    }
                }
            }
            const path =
                Platform.OS === 'ios'
                    ? RNFS.MainBundlePath + '/xforms'
                    : RNFS.DocumentDirectoryPath + '/custom/';
            server = new StaticServer(8080, path, {
                keepAlive: true,
                localOnly: true,
            });
            await server.start();
            setUri(server._origin);
        };
        startServer();
        return () => server && server.stop();
    }, []);

    const handleSubmit = useCallback(async () => {
        setProcessing(true);
        const answerData = formState[FORM_KEY];
        const parser = new XMLParser({
            attributeNamePrefix: '_',
        });
        const title = formObj.title;
        await createWritableSurvey({
            variables: {
                input: {
                    title,
                    answer: JSON.stringify(parser.parse(answerData.data)),
                },
            },
            optimisticResponse: {
                createWritableSurvey: {
                    __typename: 'WritableSurveyMutationPayload',
                    errors: [],
                    ok: null,
                    id: uuid.v4(),
                    title,
                },
            },
            update: () => {
                navigation.navigate('Forms');
                dispatch(resetForm(FORM_KEY));
                Toast.show(_('Survey form has been submitted!'), Toast.LONG, [
                    'RCTModalHostViewController',
                ]);
            },
        });
        setProcessing(false);
    }, [
        createWritableSurvey,
        navigation,
        dispatch,
        FORM_KEY,
        formState,
        formObj,
    ]);

    const handleMessage = useCallback(
        ({nativeEvent}) => {
            const {data} = nativeEvent;
            if (data.startsWith('data://')) {
                dispatch(
                    setFormData({
                        key: FORM_KEY,
                        value: data.substring(7),
                    }),
                );
            } else if (data.startsWith('media://')) {
                if (data?.length > 8) {
                    dispatch(
                        setFormMedia({key: FORM_KEY, value: data.substring(8)}),
                    );
                }
            } else if (data === 'submit') {
                handleSubmit();
            }
        },
        [handleSubmit, FORM_KEY, dispatch],
    );

    return (
        <>
            {!!uri && (
                <WebView
                    source={{
                        uri: `${uri}/?xform=${formObj.id}`,
                    }}
                    nestedScrollEnabled
                    injectedJavaScriptBeforeContentLoaded={initializeData}
                    onMessage={handleMessage}
                    geolocationEnabled={true}
                />
            )}
            {(processing || !uri) && <Loader loading />}
        </>
    );
};

export default WebViewForm;
