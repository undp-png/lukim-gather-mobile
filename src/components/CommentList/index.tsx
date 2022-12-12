import React, {useCallback, useState} from 'react';
import {Image, TouchableOpacity, View} from 'react-native';
import {formatDistanceToNowStrict} from 'date-fns';
import {Icon} from 'react-native-eva-icons';

import Text from 'components/Text';

import {_} from 'services/i18n';
import COLORS from 'utils/colors';
import styles from './styles';
import type {CommentType} from '@generated/types';

interface Props {
    comment?: CommentType;
    comments?: CommentType[];
    replies?: CommentType[];
    onLikePress: (comment: CommentType) => void;
    onReplyPress: (comment: CommentType) => void;
}

export const NoCommentComponent = () => {
    return (
        <View style={styles.noComment}>
            <Text title={_('No comments yet')} />
        </View>
    );
};

const CommentItem: React.FC<Props> = ({comment, onLikePress, onReplyPress}) => {
    const handleLikePress = useCallback(
        message => {
            onLikePress?.(message);
        },
        [onLikePress],
    );
    const handleReplyPress = useCallback(
        message => {
            onReplyPress?.(message);
        },
        [onReplyPress],
    );

    const name = comment?.user?.firstName
        ? `${comment?.user?.firstName} ${comment?.user?.lastName}`
        : 'User';

    return (
        <View style={styles.container}>
            <Image
                style={styles.avatar}
                source={
                    comment?.user?.avatar
                        ? {uri: comment?.user?.avatar}
                        : require('assets/images/user-placeholder.png')
                }
            />
            <View style={styles.commentItem}>
                <View style={styles.commentInfoWrapper}>
                    <Text style={styles.userInfo} title={name} />
                    <Text
                        style={styles.date}
                        title={formatDistanceToNowStrict(
                            new Date(comment?.createdAt),
                            {addSuffix: true},
                        )}
                    />
                </View>
                <View style={styles.description}>
                    <Text
                        style={styles.contentContainer}
                        title={comment?.description}
                    />
                </View>
                <View style={styles.response}>
                    <TouchableOpacity
                        style={styles.like}
                        onPress={() => handleLikePress(comment)}>
                        <Icon
                            name={comment?.hasLiked ? 'heart' : 'heart-outline'}
                            width={24}
                            height={24}
                            fill={COLORS.orange}
                        />
                        {comment?.totalLikes ? (
                            <Text
                                style={styles.likeCounter}
                                title={comment.totalLikes}
                            />
                        ) : null}
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleReplyPress(comment)}>
                        <Text style={styles.reply} title="Reply" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const CommentReplyList: React.FC<Props> = ({
    replies,
    onLikePress,
    onReplyPress,
}) => {
    const [totalReplies, setTotalReplies] = useState<number>(
        replies ? replies.length - 1 : 0,
    );
    const reply = replies && totalReplies ? [replies[0]] : replies;

    const handlePress = useCallback(() => {
        setTotalReplies(0);
    }, []);

    return (
        <View style={styles.replyContainer}>
            {reply?.map((item: CommentType) => (
                <CommentItem
                    comment={item}
                    key={item?.id}
                    onLikePress={onLikePress}
                    onReplyPress={onReplyPress}
                />
            ))}
            {totalReplies > 0 ? (
                <TouchableOpacity onPress={handlePress}>
                    <Text
                        style={styles.more}
                        title={`View ${totalReplies} more replies`}
                    />
                </TouchableOpacity>
            ) : null}
        </View>
    );
};

const CommentList: React.FC<Props> = ({
    comments,
    onLikePress,
    onReplyPress,
}) => {
    return (
        <>
            {comments?.map((item: CommentType) => {
                return (
                    <>
                        <CommentItem
                            key={item?.id}
                            comment={item}
                            onLikePress={onLikePress}
                            onReplyPress={onReplyPress}
                        />
                        {item?.replies.length > 0 && (
                            <CommentReplyList
                                replies={item?.replies}
                                onLikePress={onLikePress}
                                onReplyPress={onReplyPress}
                            />
                        )}
                    </>
                );
            })}
        </>
    );
};

export default CommentList;
