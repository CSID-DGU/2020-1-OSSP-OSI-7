import axios from 'axios';

const client = axios.create({proxy: {
    host: 'https://34.64.101.170',
    port: 8000
  }});

client.defaults.baseURL = 'https://34.64.101.170:8000/'
client.defaults.headers.common['Content-Type'] = 'application/json';

axios.interceptors.response.use(
    response => {
        console.log(response);
        return response;
    },
    error => {
        console.log(error);
        return Promise.reject(error);
    }
)

export default client;