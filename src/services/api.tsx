import {BASE_URL} from '@env';

import RequestBuilder from '@rna/services/request';

export const request = new RequestBuilder(BASE_URL)
    .setResponseInterceptors([console.log])
    .setRetryConfig({backoffFactor: 0, maxRetries: 2})
    .build();

class Api {
    async get(url, options) {
        const {error, data, response} = await request(url, options);
        if (error) {
            if (response.status === 500) {
                throw new Error('500 Internal Server Error');
            }
            console.log(data);
            throw data || 'Request Error';
        }
        return data;
    }

    async post(url, body) {
        const {error, data, response} = await request(url, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify(body),
        });
        if (error) {
            if (response.status === 500) {
                throw new Error('500 Internal Server Error');
            }
            console.log(data);
            throw data || 'Request Error';
        }
        return data;
    }

    async patch(url, body) {
        const {error, data, response} = await request(url, {
            method: 'PATCH',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify(body),
        });
        if (error) {
            if (response.status === 500) {
                throw new Error('500 Internal Server Error');
            }
            console.log(data);
            throw data || 'Request Error';
        }
        return data;
    }

    async put(url, body) {
        const {error, data, response} = await request(url, {
            method: 'PUT',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify(body),
        });
        if (error) {
            if (response.status === 500) {
                throw new Error('500 Internal Server Error');
            }
            console.log(data);
            throw data || 'Request Error';
        }
        return data;
    }

    async delete(url) {
        const {error, data, response} = await request(url, {
            method: 'DELETE',
        });
        if (error) {
            if (response.status === 500) {
                throw new Error('500 Internal Server Error');
            }
            console.log(data);
            throw data || 'Request Error';
        }
        return data;
    }
}

const ApiService = new Api();

export default ApiService;
