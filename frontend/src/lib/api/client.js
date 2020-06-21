import axios from 'axios';

const client = axios.create({proxy: {
    host: 'https://34.64.101.170',
    port: 8000
  }});

client.defaults.baseURL = 'https://34.64.101.170:8000/'
client.defaults.headers.common['Content-Type'] = 'application/json';

const getToken= ()=>{
    if(localStorage.getItem('user_info')){
        const local = JSON.parse(localStorage.getItem("user_info"));
        return local.token;
    }
    return "";
}


client.defaults.headers.common['Authorization'] = "Bearer " + getToken();


client.interceptors.request.use(async (config) => {
    try{
        // In this moment, show the spinner
        // showLoading();
        if(localStorage.getItem('user_info')){
            const local = JSON.parse(localStorage.getItem("user_info"));
            if( Date.now() > local.exp){
                console.log("token check expired");
                alert("token is expired");
            }
            client.defaults.headers.common['Authorization'] = "Bearer " + local.token;
        }
        const style = [
            'background-image: url("https://media.giphy.com/media/RHEqKwRZDwFKE/giphy.gif")',
            'background-size: cover',
            'color: black',
            'font-weight: 600',
            'padding: 10px 20px',
            'line-height: 35px'
            ].join(';');
        
            console.log('Loading...!    %c               ', style);
    }
    catch(e)
    {
        alert('Error request' + e);
    }

    return config;
});


client.interceptors.response.use(
    response => {
        // console.log("It's response", response);
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