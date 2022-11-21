import {useMutation} from '@apollo/client';
import React, {useCallback, useState} from 'react';
import {View} from 'react-native';
import {RootStateOrAny, useSelector} from 'react-redux';
import Toast from 'react-native-simple-toast';

import CommentList, {NoCommentComponent} from 'components/CommentList';
import CommentInput from 'components/CommentInput';

import {_} from 'services/i18n';
import {
    CREATE_COMMENT,
    DISLIKE_COMMENT,
    LIKE_COMMENT,
} from 'services/gql/queries';
import {getErrorMessage} from 'utils/error';

import type {
    CommentType,
    CreateCommentMutation,
    CreateCommentMutationVariables,
    DislikeCommentMutation,
    DislikeCommentMutationVariables,
    LikeCommentMutation,
    LikeCommentMutationVariables,
} from '@generated/types';

import styles from './styles';

interface Props {
    surveyId: string;
    commentItem?: CommentType[];
    refetch: () => void;
}

const Comment: React.FC<Props> = ({surveyId, commentItem, refetch}) => {
    const {isAuthenticated} = useSelector(
        (state: RootStateOrAny) => state.auth,
    );
    const [reply, setReply] = useState<CommentType | null>(null);

    const [createComment] = useMutation<
        CreateCommentMutation,
        CreateCommentMutationVariables
    >(CREATE_COMMENT, {
        onCompleted: () => {
            Toast.show('Comment created Successfully !');
            refetch();
        },
        onError: err => {
            Toast.show(getErrorMessage(err), Toast.LONG, [
                'RCTModalHostViewController',
            ]);
        },
    });

    const [likeComment] = useMutation<
        LikeCommentMutation,
        LikeCommentMutationVariables
    >(LIKE_COMMENT, {
        onCompleted: () => {
            Toast.show('Comment liked Successfully !');
            refetch();
        },
        onError: err => {
            Toast.show(getErrorMessage(err), Toast.LONG, [
                'RCTModalHostViewController',
            ]);
        },
    });

    const [dislikeComment] = useMutation<
        DislikeCommentMutation,
        DislikeCommentMutationVariables
    >(DISLIKE_COMMENT, {
        onCompleted: () => {
            Toast.show('Comment disliked Successfully !');
            refetch();
        },
        onError: err => {
            Toast.show(getErrorMessage(err), Toast.LONG, [
                'RCTModalHostViewController',
            ]);
        },
    });

    const handleCommentPress = useCallback(
        message => {
            if (!isAuthenticated) {
                return Toast.show(_('You are not logged in!'));
            }
            createComment({
                variables: {
                    input: {
                        objectId: surveyId,
                        description: message,
                        contentType: 'happeningsurvey',
                        ...(reply && {parent: reply?.id}),
                    },
                },
            });
            setReply(null);
        },
        [isAuthenticated, createComment, surveyId, reply],
    );

    const handleLikePress = useCallback(
        comment => {
            if (!isAuthenticated) {
                return Toast.show(_('You are not logged in!'));
            }
            if (comment.hasLiked) {
                dislikeComment({
                    variables: {id: Number(comment.id)},
                });
            } else {
                likeComment({
                    variables: {
                        input: {
                            comment: comment.id,
                        },
                    },
                });
            }
        },
        [isAuthenticated, dislikeComment, likeComment],
    );

    const handleReplyPress = useCallback(
        comment => {
            if (!isAuthenticated) {
                return Toast.show(_('You are not logged in!'));
            }
            setReply(comment);
        },
        [isAuthenticated],
    );

    return (
        <>
            <View style={styles.container}>
                {commentItem?.length === 0 && <NoCommentComponent />}
                {commentItem && (
                    <CommentList
                        comments={commentItem}
                        onLikePress={handleLikePress}
                        onReplyPress={handleReplyPress}
                    />
                )}
            </View>
            <CommentInput
                onPress={handleCommentPress}
                reply={reply}
                setReply={setReply}
            />
        </>
    );
};

export default Comment;
