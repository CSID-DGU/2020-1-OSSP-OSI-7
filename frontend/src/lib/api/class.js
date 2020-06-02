import client from './client';

export const createClass = ({class_info}) =>{
    client.post('/class/', class_info );
}

export const enrollClass = ({class_code}) => {
    client.post(`/class/enroll/${class_code}`, class_code);
}

export const getManagingClass = ({username}) =>{
    client.get(`/user/classes/managing/${username}`);
}