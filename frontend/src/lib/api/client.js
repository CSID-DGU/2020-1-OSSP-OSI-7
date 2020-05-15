import axios from 'axios';

const client = axios.create();

client.defaults.baseURL = 'https://34.64.101.170:8000/'

client.defaults.headers.common['Authorization'] = 'Bearer asdfasdf';

axios.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        return Promise.reject(error);
    }
)

export default client;