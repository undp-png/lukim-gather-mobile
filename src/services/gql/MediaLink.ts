import {
    ApolloLink,
    type Operation,
    type NextLink,
} from '@apollo/client/link/core';
import {ApolloClient} from '@apollo/client';
import {ReactNativeFile} from 'apollo-upload-client';

import {_} from 'services/i18n';

import Toast from 'utils/toast';
import {getErrorMessage} from 'utils/error';

import {dispatchResetForm} from 'services/dispatch';

class MediaLink extends ApolloLink {
    mediaFiles: {title: string; media: string}[];
    pendingCustomFormOperations: Operation[];
    client: ApolloClient<any>;

    constructor(client: ApolloClient<any>) {
        super();

        this.client = client;

        this.mediaFiles = [];
        this.pendingCustomFormOperations = [];
    }

    request(operation: Operation, forward: NextLink) {
        const isMutation = operation.query.definitions.some(
            e => (e as any).operation === 'mutation',
        );

        if (isMutation && operation.variables.input?.attachment?.length > 0) {
            operation.variables.input.attachment =
                operation.variables.input.attachment.map(
                    (att: any) => new ReactNativeFile(att),
                );
        }
        if (isMutation && operation.variables.input?.audioFile?.uri) {
            operation.variables.input.audioFile = new ReactNativeFile(
                operation.variables.input.audioFile,
            );
        }
        if (
            isMutation &&
            operation.operationName === 'UploadMedia' &&
            operation.variables.media?.uri
        ) {
            operation.variables.media = new ReactNativeFile(
                operation.variables.media,
            );
        }
        if (
            isMutation &&
            operation.operationName === 'CreateWritableSurvey' &&
            operation.getContext().hasInvalidMedia
        ) {
            this.pendingCustomFormOperations.push(operation);
            return null;
        }

        return forward(operation).map(response => {
            if (isMutation && operation.operationName === 'UploadMedia') {
                const uploadResult = response?.data?.uploadMedia?.result;
                if (uploadResult) {
                    this.mediaFiles.push({
                        title: uploadResult.title,
                        media: uploadResult.media,
                    });
                }
            }
            if (this.pendingCustomFormOperations.length > 0) {
                this.pendingCustomFormOperations
                    .map(op => {
                        let modifiedAnswer = op.variables.input?.answer || '';
                        this.mediaFiles.forEach(mediaFile => {
                            if (
                                mediaFile.media &&
                                !modifiedAnswer.includes(mediaFile.media)
                            ) {
                                modifiedAnswer = modifiedAnswer.replace(
                                    new RegExp(mediaFile.title, 'g'),
                                    mediaFile.media,
                                );
                            }
                        });
                        op.variables.input.answer = modifiedAnswer;
                        return op;
                    })
                    .forEach(formOperation => {
                        formOperation.setContext({
                            hasInvalidMedia: false,
                        });
                        this.client
                            .mutate({
                                mutation: formOperation.query,
                                variables: formOperation.variables,
                                context: formOperation.getContext(),
                            })
                            .then(() => {
                                Toast.show(_('Success'), {
                                    text2: _(
                                        'Survey has been created successfully!',
                                    ),
                                });
                                dispatchResetForm(
                                    formOperation.getContext().formKey,
                                );
                            })
                            .catch(err => {
                                Toast.error(_('Error!'), getErrorMessage(err));

                                console.log('[Create Survey Error]: ', err);
                            });
                    });
                this.mediaFiles = [];
                this.pendingCustomFormOperations = [];
            }
            return response;
        });
    }
}

export default MediaLink;
