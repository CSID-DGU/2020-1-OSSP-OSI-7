import client from './client';

export const createClass = async ({class_code, class_name}) =>{
    await client.post('/class/', {class_code, class_name}).then(
        (res)=>{
             return res}).catch((e)=>{
                 return Promise.reject(e)});
}

export const enrollClass = ({class_code}) => {
    client.post(`/class/enroll/${class_code}`, class_code);
}

export const getManagingClass = async(username) =>
    await client.get(`/user/classes/managing/${username}`)
