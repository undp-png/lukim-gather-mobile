import gql from 'graphql-tag';

export const LOGIN = gql`
    mutation TokenAuth($username: String!, $password: String!) {
        tokenAuth(username: $username, password: $password) {
            token
            refreshToken
            user {
                firstName
                lastName
                email
                organization
                avatar
            }
        }
    }
`;

export const GET_HAPPENING_SURVEY = gql`
    query {
        happeningSurveys {
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
            attachment {
                media
            }
            category {
                id
                title
            }
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
                attachment {
                    media
                }
                category {
                    __typename
                    id
                    title
                }
            }
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

export const CHANGE_PASSWORD = gql`
    mutation ChangePassword($data: ChangePasswordInput!) {
        changePassword(data: $data) {
            ok
        }
    }
`;

export const GET_QUESTION_GROUPS = gql`
    query {
        questionGroup {
            id
            code
            title
            questions {
                id
                code
                title
                description
                answerType
                isRequired
                options {
                    id
                    title
                }
            }
        }
    }
`;
