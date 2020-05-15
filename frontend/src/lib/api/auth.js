import client from './client';

export const login = ({username, password}) =>
    client.post('/login', {username,password});

export const registerTo = ({username, password}) =>
    client.post('/register', {username,password}).then((response) => console.log(response));

export const check = () => client.get('/check');