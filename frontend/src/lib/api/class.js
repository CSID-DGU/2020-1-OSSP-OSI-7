import client from './client';

export const createClass = async ({class_code, class_name}) =>{
    await client.post('/class/', {class_code, class_name}).then(
        (res)=>{console.log(res);
             return res}).catch((e)=>console.log(e));
}

export const enrollClass = ({class_code}) => {
    client.post(`/class/enroll/${class_code}`, class_code);
}

export const getManagingClass = ({username}) =>{
    client.get(`/user/classes/managing/${username}`);
}