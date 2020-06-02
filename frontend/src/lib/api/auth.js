import client from './client';
import jwt_decode from 'jwt-decode';

// const sendRequest = ({requestFunction})=> {
//     let loading = false;
//     let response = null;
//     let error = null;

//     async ()=> {
//         error(null); 
//         try {
//             loading(true)
//             const res = await requestFunction();
//             response(res); 
//         } catch (e) {
//             error(e); 
//         }
//         loading(false); 
//     }
//     return [response, loading, error];
// }


// const sendLogin = () =>{

// }
export const login = async ({username, password}) =>
    await client.post('/login', {username,password}).then((response)=>{
        // 토큰 저장
        if(response.data.token){
            const token = response.data.token;
            const decoded = jwt_decode(token);
            localStorage.setItem(
                "user_info",
                JSON.stringify({
                    user:decoded.UserName,
                  token: token}));
            client.defaults.headers.common['Authorization'] = "Bearer " + token;
            return decoded.UserName;
        }
        }
    );

export const registerTo = async ({username,password, nickname, student_code, email}) =>{
    student_code = Number(student_code);
    await client.post('/register', {username,password, nickname, student_code, email}).then(
        (response) => {
            console.log("이거지" +response)
            return response;
        }
    )}


export const check = (username) => client.get(`/users/${username}`);