import client from './client';

export const quizSubmit = (quizset) =>
    client.post('/quizsets/quizset', quizset);

export const getQuizSetList = (username) =>
    client.get(`/quizsets/users/${username}`);

export const addQuiz2Class = (quizSetId, classCode) =>
    client.post(`/quizsets/quizset/${quizSetId}/class/${classCode}`,{quizSetId:quizSetId.toString(),classCode:classCode});

export const quizDetail = ({quizSetId}) =>
    client.get(`/quizset/${quizSetId}/`);
