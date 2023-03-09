import gql from 'graphql-tag';

export const LOGIN = gql`
    mutation TokenAuth($username: String!, $password: String!) {
        tokenAuth(username: $username, password: $password) {
            token
            refreshToken
            user {
                id
                firstName
                lastName
                email
                organization
                avatar
            }
        }
    }
`;

export const REFRESH_TOKEN = gql`
    mutation RefreshToken($refreshToken: String) {
        refreshToken(refreshToken: $refreshToken) {
            token
            refreshToken
        }
    }
`;

export const GET_HAPPENING_SURVEY = gql`
    query HappeningSurveys($id: UUID, $ordering: String) {
        happeningSurveys(id: $id, ordering: $ordering) {
            id
            title
            description
            location {
                type
                coordinates
            }
            boundary {
                type
                coordinates
            }
            sentiment
            improvement
            isTest
            isPublic
            attachment {
                id
                media
            }
            category {
                id
                title
            }
            createdBy {
                id
            }
            createdAt
            modifiedAt
            isOffline
            project {
                id
                title
            }
        }
    }
`;

export const GET_HAPPENING_SURVEY_HISTORY = gql`
    query GetHappeningSurveysHistory($surveyId: String) {
        happeningSurveysHistory(objectId: $surveyId) {
            id
            serializedData {
                fields {
                    modifiedAt
                }
            }
        }
    }
`;

export const GET_HAPPENING_SURVEY_HISTORY_ITEM = gql`
    query GetHappeningSurveysHistoryItem($surveyId: String, $id: ID) {
        happeningSurveysHistory(objectId: $surveyId, id: $id) {
            serializedData {
                fields {
                    title
                    description
                    location {
                        type
                        coordinates
                    }
                    boundary {
                        type
                        coordinates
                    }
                    sentiment
                    improvement
                    isTest
                    isPublic
                    attachment {
                        id
                        media
                    }
                    category {
                        id
                        title
                    }
                    createdBy {
                        id
                    }
                    createdAt
                    modifiedAt
                    isOffline
                    project {
                        id
                        title
                    }
                }
            }
        }
    }
`;

export const CREATE_HAPPENING_SURVEY = gql`
    mutation CreateHappeningSurvey(
        $anonymous: Boolean!
        $input: HappeningSurveyInput!
    ) @serialize(key: ["createupdatedeletesurvey"]) {
        createHappeningSurvey(data: $input, anonymous: $anonymous) {
            __typename
            errors
            ok
            result {
                id
                title
                description
                location {
                    type
                    coordinates
                }
                boundary {
                    type
                    coordinates
                }
                sentiment
                improvement
                isTest
                isPublic
                attachment {
                    id
                    media
                }
                category {
                    id
                    title
                }
                createdBy {
                    id
                }
                createdAt
                modifiedAt
                isOffline
                project {
                    id
                    title
                }
            }
        }
    }
`;

export const EDIT_HAPPENING_SURVEY = gql`
    mutation EditHappeningSurvey(
        $input: UpdateHappeningSurveyInput!
        $id: UUID!
    ) @serialize(key: ["createupdatedeletesurvey"]) {
        editHappeningSurvey(data: $input, id: $id) {
            __typename
            errors
            ok
            result {
                id
                title
                description
                location {
                    type
                    coordinates
                }
                boundary {
                    type
                    coordinates
                }
                sentiment
                improvement
                isTest
                isPublic
                attachment {
                    id
                    media
                }
                category {
                    __typename
                    id
                    title
                }
                createdBy {
                    id
                }
                createdAt
                modifiedAt
                isOffline
                project {
                    id
                    title
                }
            }
        }
    }
`;

export const UPDATE_HAPPENING_SURVEY = gql`
    mutation UpdateHappeningSurvey(
        $input: UpdateHappeningSurveyInput!
        $id: UUID!
    ) {
        updateHappeningSurvey(data: $input, id: $id) {
            __typename
            errors
            ok
            result {
                id
                title
                description
                location {
                    type
                    coordinates
                }
                boundary {
                    type
                    coordinates
                }
                sentiment
                improvement
                isTest
                isPublic
                attachment {
                    id
                    media
                }
                category {
                    __typename
                    id
                    title
                }
                createdBy {
                    id
                }
                createdAt
                modifiedAt
                isOffline
                project {
                    id
                    title
                }
            }
        }
    }
`;

export const DELETE_HAPPENING_SURVEY = gql`
    mutation DeleteHappeningSurvey($id: UUID!)
    @serialize(key: ["createupdatedeletesurvey"]) {
        deleteHappeningSurvey(id: $id) {
            ok
            errors
        }
    }
`;

export const DELETE_ACCOUNT = gql`
    mutation DeleteAccount($data: AccountDeletionRequestMutationInput!) {
        deleteAccount(input: $data) {
            reason
        }
    }
`;

export const UPLOAD_IMAGE = gql`
    mutation UploadMedia($title: String!, $type: String!, $media: Upload) {
        uploadMedia(title: $title, type: $type, media: $media) {
            ok
            result {
                id
            }
        }
    }
`;

export const SIGNUP = gql`
    mutation RegisterUser($data: RegisterUserInput!) {
        registerUser(data: $data) {
            ok
            errors
        }
    }
`;

export const EMAIL_CONFIRM = gql`
    mutation EmailConfirm($data: EmailConfirmInput!) {
        emailConfirm(data: $data) {
            ok
        }
    }
`;

export const EMAIL_CONFIRM_VERIFY = gql`
    mutation EmailConfirmVerify($data: EmailConfirmInput!) {
        emailConfirmVerify(data: $data) {
            ok
        }
    }
`;

export const PHONE_NUMBER_CONFIRM = gql`
    mutation PhoneNumberConfirm($data: PhoneNumberConfirmInput!) {
        phoneNumberConfirm(data: $data) {
            ok
            errors
        }
    }
`;

export const PHONE_NUMBER_CONFIRM_VERIFY = gql`
    mutation PhoneNumberConfirmVerify($data: PhoneNumberConfirmInput!) {
        phoneNumberVerify(data: $data) {
            token
            refreshToken
            user {
                id
                firstName
                lastName
                email
                organization
                avatar
            }
        }
    }
`;

export const GET_USER_PROJECTS = gql`
    query GetUserProjects {
        me {
            projects {
                id
                title
                description
            }
        }
    }
`;

export const UPDATE_USER = gql`
    mutation UpdateUser($data: UserInput!) {
        updateUser(data: $data) {
            ok
            errors
            result {
                id
                firstName
                lastName
                email
                organization
                avatar
            }
        }
    }
`;

export const CHANGE_PASSWORD = gql`
    mutation ChangePassword($data: ChangePasswordInput!) {
        changePassword(data: $data) {
            ok
        }
    }
`;

export const PASSWORD_RESET = gql`
    mutation PasswordReset($data: PasswordResetPinInput!) {
        passwordReset(data: $data) {
            ok
        }
    }
`;

export const PASSWORD_RESET_VERIFY = gql`
    mutation PasswordResetVerify($data: PasswordResetPinInput!) {
        passwordResetVerify(data: $data) {
            ok
            result {
                identifier
            }
        }
    }
`;

export const PASSWORD_RESET_CHANGE = gql`
    mutation PasswordResetChange($data: PasswordResetChangeInput!) {
        passwordResetChange(data: $data) {
            ok
        }
    }
`;

export const GET_SURVEY_FORMS = gql`
    {
        surveyForm {
            id
            title
            xform
        }
    }
`;

export const CREATE_WRITABLE_SURVEY = gql`
    mutation CreateWritableSurvey($input: WritableSurveyMutationInput!) {
        createWritableSurvey(input: $input) {
            id
            title
            errors {
                field
                messages
            }
        }
    }
`;

export const GET_LEGAL_DOCUMENT = gql`
    query {
        legalDocument {
            id
            documentType
            description
        }
    }
`;

export const CREATE_FEEDBACK = gql`
    mutation CreateFeedback($input: FeedbackMutationInput!) {
        createFeedback(input: $input) {
            id
        }
    }
`;

export const GET_NOTIFICATIONS = gql`
    {
        notifications {
            actionObjectObjectId
            id
            createdAt
            description
            hasRead
            notificationType
        }
    }
`;

export const GET_NOTIFICATIONS_UNREAD_COUNT = gql`
    {
        notificationUnreadCount
    }
`;

export const MARK_AS_READ = gql`
    mutation MarkAsRead($id: Int) {
        markAsRead(pk: $id) {
            detail
        }
    }
`;

export const CREATE_COMMENT = gql`
    mutation CreateComment($input: CommentMutationInput!) {
        createComment(input: $input) {
            id
            description
            errors {
                field
                messages
            }
        }
    }
`;

export const UPDATE_COMMENT = gql`
    mutation UpdateComment($input: UpdateCommentInput!) {
        updateComment(input: $input) {
            ok
            errors {
                field
                messages
            }
        }
    }
`;

export const LIKE_COMMENT = gql`
    mutation LikeComment($input: LikeCommentMutationInput!) {
        likeComment(input: $input) {
            id
            errors {
                field
                messages
            }
        }
    }
`;

export const DISLIKE_COMMENT = gql`
    mutation DislikeComment($id: Int!) {
        dislikeComment(id: $id) {
            ok
            errors
        }
    }
`;

export const GET_HAPPENING_SURVEY_COMMENTS = gql`
    query Comments($surveyId: String!, $level: Int) {
        comments(objectId: $surveyId, level: $level) {
            id
            createdAt
            description
            totalLikes
            hasLiked
            isDeleted
            user {
                id
                firstName
                lastName
                avatar
            }
            replies {
                id
                createdAt
                description
                totalLikes
                hasLiked
                isDeleted
                user {
                    id
                    firstName
                    lastName
                    avatar
                }
            }
        }
    }
`;

export const DELETE_COMMENT = gql`
    mutation DeleteComment($id: ID!) {
        deleteComment(id: $id) {
            ok
            errors {
                field
                messages
            }
        }
    }
`;
