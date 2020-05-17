import client from './client';

export const quizSubmit = ({quizset}) =>
    client.post('/quizset/', quizset);

export const quizList = () =>
    client.get('/quizzes/');

export const quizDetail = ({quizId}) =>
    client.get(`/quizzes/${quizId}/`);

export const 