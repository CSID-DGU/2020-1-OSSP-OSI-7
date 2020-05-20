import client from './client';

export const login = ({username, password}) =>
    ({user: username,token:`${username}_${password}`});

export const registerTo = ({username, password}) =>
    ({user: username,token:`${username}_${password}`});

export const check = () => client.get('/check');