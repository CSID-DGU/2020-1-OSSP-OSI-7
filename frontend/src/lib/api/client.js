import axios from 'axios';
import jwt_decode from 'jwt-decode';

const client = axios.create({proxy: {
    host: 'https://34.64.101.170',
    port: 8000
  }});

client.defaults.baseURL = 'https://34.64.101.170:8000/'
client.defaults.headers.common['Content-Type'] = 'application/json';

client.interceptors.response.use(
    response => {
        if(response.data.token){
            const token = response.data.token;
            const decoded = jwt_decode(token);
            console.log(decoded);
            localStorage.setItem(
                "user_info",
                JSON.stringify({
                    "user":decoded.UserName,
                  "token": token}));
            client.defaults.headers.common['Authorization'] = "Bearer " + token;
        }
        return response;
    },
    error => {
        console.log(error);
        return Promise.reject(error);
    }
)

export default client;