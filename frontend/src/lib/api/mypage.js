import axios from 'axios';


export const getAvatar = (username) =>
    axios.get(`https://api.github.com/users/${username}`);