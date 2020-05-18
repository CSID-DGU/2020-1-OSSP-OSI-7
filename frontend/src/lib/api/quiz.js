import client from './client';

export const quizSubmit = ({quizset}) =>
    client.post('/quizset/', quizset);

export const quizList = () =>
    client.get('/quizset/');

export const quizDetail = ({quizSetId}) =>
    client.get(`/quizset/${quizSetId}/`);

export const 