import axios from 'axios';

const client = axios.create({proxy: {
    host: 'https://34.64.101.170',
    port: 8000
  }});

client.defaults.baseURL = 'https://34.64.101.170:8000/'
client.defaults.headers.common['Content-Type'] = 'application/json';

client.interceptors.request.use(async (config) => {
    try{
        // In this moment, show the spinner
        // showLoading();
        console.log("loading.....");
    }
    catch(e)
    {
        alert('Error request' + e);
    }

    return config;
});


client.interceptors.response.use(
    response => {
        console.log("It's response", response);
        return response;
    },
    error => {
        console.log(error);
        return Promise.reject(error);
    }
)

export default client;