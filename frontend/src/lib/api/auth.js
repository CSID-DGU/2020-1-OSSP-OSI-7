import client from './client';

export const login = ({username, password}) =>
    client.post('/login', {username,password}
        ).then((response) => console.log(response));

export const registerTo = ({username,password, nickname, student_code, email}) =>{
    student_code = Number(student_code);
    client.post('/register', {username,password, nickname, student_code, email}
        ).then((response) => console.log(response)).catch(
            (err) => console.log(err)
        );
}
export const check = () => client.get('/check');