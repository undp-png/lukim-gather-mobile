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
            improvement
            attachment {
                media
            }
            category {
                id
                title
            }
            createdBy {
                id
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
                createdBy {
                    id
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
                attachment {
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

export const CHANGE_PASSWORD = gql`
    mutation ChangePassword($data: ChangePasswordInput!) {
        changePassword(data: $data) {
            ok
        }
    }
`;

export const GET_SURVEY_FORMS = gql`
    query {
        surveyForm {
            id
            code
            title
            questionGroup {
                id
                code
                title
                questions {
                    id
                    code
                    title
                    hints
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
