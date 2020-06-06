import axios from 'axios';

const client = axios.create({proxy: {
    host: 'https://34.64.101.170',
    port: 8000
  }});

client.defaults.baseURL = 'https://34.64.101.170:8000/'
client.defaults.headers.common['Content-Type'] = 'application/json';

client.defaults.headers.common['Authorization'] = "Bearer " + "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VyTmFtZSI6InRlc3RAZGd1LmFjLmtyIiwiZXhwIjoxNTkxNDMwOTg2LCJvcmlnX2lhdCI6MTU5MTQyNzM4Nn0.-q6mY5zFSZS48IrbrQQoCUK3-gmvjeSKisExYkJ9ykc";


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
        console.log(error.response);
        // if(error.response.status === 401){

        // }
        return Promise.reject(error);
    }
)

export default client;