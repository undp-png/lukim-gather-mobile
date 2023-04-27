import React, {useEffect, useState, useMemo, useCallback} from 'react';
import {Platform, View} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector, RootStateOrAny} from 'react-redux';

import {WebView} from 'react-native-webview';
import StaticServer from 'react-native-static-server';
import RNFS from 'react-native-fs';
import Toast from 'react-native-simple-toast';
import {useMutation} from '@apollo/client';
import {XMLParser} from 'fast-xml-parser';
import {ReactNativeFile} from 'apollo-upload-client';

import {setFormData, setFormMedia, resetForm} from 'store/slices/form';

import {Loader} from 'components/Loader';
import {_} from 'services/i18n';

import {
    FormType,
    CreateWritableSurveyMutation,
    CreateWritableSurveyMutationVariables,
} from '@generated/types';
import {CREATE_WRITABLE_SURVEY, UPLOAD_IMAGE} from 'services/gql/queries';
import {getErrorMessage} from 'utils/error';
import {b64toPath} from 'utils/blob';

import type {ProjectType} from '@generated/types';

import styles from './styles.tsx';

export type FormDataType = {
    data?: string;
    media?: string;
};

interface RouteParams {
    params: {
        form: FormType;
        data?: FormDataType;
        projects?: ProjectType[];
    };
    name: string;
    path?: string | undefined;
    key: string;
}

let QUEUE: Promise<any>[] = [];
let FORMDATA = '';

const WebViewForm: React.FC = () => {
    const {
        params: {form: formObj, data: formData, projects},
    } = useRoute<RouteParams>();

    useEffect(() => {
        QUEUE = [];
    }, []);

    const dispatch = useDispatch();

    const navigation = useNavigation();
    const [uri, setUri] = useState<string | undefined>();
    const [processing, setProcessing] = useState<boolean>(false);

    const FORM_KEY = useMemo(() => `survey_data__${formObj.id}`, [formObj]);
    const initializeData = useMemo(() => {
        let model = formObj.xform.model;
        let form = formObj.xform.form;

        if (formData?.data?.length) {
            model = model.replace(/<data(.*?)<\/data>/, formData.data);
        }
        const projectsXML = projects?.reduce(
            (a, c) => `${a}<option value="${c.title}">${c.title}</option>`,
            '',
        );
        form = form.replace(
            /(<select name=.*project_name.*None<\/option>)(.*?)(<\/select>)/,
            `$1${projectsXML}$3`,
        );

        return `
            window._formStr = \`${form}\`;
            window._modelStr = \`${model}\`;
            true;
        `;
    }, [formObj, formData, projects]);

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
        let server: typeof StaticServer;
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

    const [uploadMedia] = useMutation(UPLOAD_IMAGE, {
        onCompleted: ({uploadMedia}) => {
            const newAnswer = FORMDATA.replace(
                uploadMedia.result.title,
                uploadMedia.result.media,
            );
            setFormData({
                key: FORM_KEY,
                value: newAnswer,
            });
            FORMDATA = newAnswer;
        },
        onError: ({graphQLErrors}) => {
            console.log(graphQLErrors);
        },
    });

    const handleSubmit = useCallback(async () => {
        setProcessing(true);
        const parser = new XMLParser({
            attributeNamePrefix: '_',
        });
        const title = formObj.title;
        await createWritableSurvey({
            variables: {
                input: {
                    title,
                    answer: JSON.stringify(parser.parse(FORMDATA)),
                },
            },
            optimisticResponse: {
                createWritableSurvey: {
                    __typename: 'WritableSurveyMutationPayload',
                    errors: [],
                    id: Math.floor(Math.random() * 32), // This is not uuid. So uses random integer upto 31
                    title,
                },
            },
            update: () => {
                setProcessing(false);
                navigation.navigate('Forms');
                dispatch(resetForm(FORM_KEY));
                Toast.show(_('Survey form has been submitted!'), Toast.LONG, [
                    'RCTModalHostViewController',
                ]);
            },
        });
    }, [createWritableSurvey, navigation, FORM_KEY, formObj, dispatch]);

    const handleMessage = useCallback(
        async ({nativeEvent}) => {
            const {data} = nativeEvent;
            if (data.startsWith('data://')) {
                dispatch(
                    setFormData({
                        key: FORM_KEY,
                        value: data.substring(7),
                    }),
                );
                FORMDATA = data.substring(7);
            } else if (data.startsWith('media://')) {
                if (data?.length > 8) {
                    dispatch(
                        setFormMedia({key: FORM_KEY, value: data.substring(8)}),
                    );
                }
            } else if (data.startsWith('data:image')) {
                const imageParts = data.split(';');
                const name = imageParts.pop() as string;
                const imgBlob = await b64toPath(imageParts.join(';'));
                //imgBlob.name = name;
                const file = new ReactNativeFile({
                    uri: imgBlob,
                    name,
                    type: data.substring(
                        data.indexOf(':') + 1,
                        data.indexOf(';'),
                    ),
                });
                QUEUE.push(
                    uploadMedia({
                        variables: {
                            media: file,
                            title: name,
                            type: 'image',
                        },
                    }),
                );
            } else if (data === 'submit') {
                await Promise.all(QUEUE);
                handleSubmit();
            }
        },
        [handleSubmit, FORM_KEY, dispatch, uploadMedia],
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
            {(processing || !uri) && (
                <View style={styles.loading}>
                    <Loader loading />
                </View>
            )}
        </>
    );
};
export default WebViewForm;
