export const getErrorMessage = error => {
    if (error.detail) {
        return error.detail;
    }
    if (error.non_field_errors) {
        return error.non_field_errors[0];
    }
    if (error && typeof error === 'object') {
        if (error.hasOwnProperty('graphQLErrors')) {
            return error.message;
        }
        for (const [key, value] of Object.entries(error)) {
            return `${
                key === 'username' ? 'email' : key.replaceAll('_', ' ')
            }: ${value}`;
        }
    }
    if (error.message) {
        return error.message;
    }
    return 'An error occured!';
};
