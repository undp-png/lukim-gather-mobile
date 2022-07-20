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
    query HappeningSurveys($id: UUID) {
        happeningSurveys(id: $id) {
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
        }
    }
`;

export const CREATE_HAPPENING_SURVEY = gql`
    mutation CreateHappeningSurvey($input: HappeningSurveyInput!) {
        createHappeningSurvey(data: $input) {
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
            }
        }
    }
`;

export const DELETE_HAPPENING_SURVEY = gql`
    mutation DeleteHappeningSurvey($id: UUID!) {
        deleteHappeningSurvey(id: $id) {
            ok
            errors
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
