import React, {useEffect, useState, useMemo, useCallback} from 'react';
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

    const FORM_KEY = `survey_data__${formObj.id}`;

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
        onError: err => {
            Toast.show(getErrorMessage(err), Toast.LONG, [
                'RCTModalHostViewController',
            ]);
        },
    });

    useEffect((): any => {
        let server: StaticServer;
        const startServer = async () => {
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
            const path = RNFS.DocumentDirectoryPath + '/custom/';
            server = new StaticServer(8080, path, {
                keepAlive: true,
            });
            await server.start();
            setUri(server._origin);
        };
        startServer();
        return () => server && server.stop();
    }, []);

    const handleSubmit = useCallback(async () => {
        const answerData = formState[FORM_KEY];
        const parser = new XMLParser({
            attributeNamePrefix: '_',
        });
        const title = 'Local Environment Survey';
        const {data, errors} = await createWritableSurvey({
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
        });

        if (
            (errors && errors?.length > 0) ||
            (data?.createWritableSurvey?.errors &&
                data?.createWritableSurvey?.errors.length > 0)
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

        dispatch(resetForm(FORM_KEY));

        Toast.show(
            _('Survey form has been submitted successfully!'),
            Toast.LONG,
            ['RCTModalHostViewController'],
        );
        navigation.goBack();
    }, [createWritableSurvey, navigation, dispatch, FORM_KEY, formState]);

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
                    androidLayerType="software"
                    androidHardwareAccelerationDisabled={true}
                    source={{
                        uri: `${uri}/?xform=${formObj.id}`,
                    }}
                    injectedJavaScriptBeforeContentLoaded={initializeData}
                    onMessage={handleMessage}
                />
            )}
            <Loader loading={loading || !uri} />
        </>
    );
};

export default WebViewForm;
