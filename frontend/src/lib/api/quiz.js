import client from './client';

export const quizSubmit = (quizset) =>
    client.post('/quizsets/quizset', quizset);

export const getQuizSetList = (username) =>
    client.get(`/quizsets/users/${username}`);

export const addQuiz2Class = (quizSetId, classCode) =>
    client.post(`/quizsets/quizset/${quizSetId}/class/${classCode}`,{quizSetId:quizSetId.toString(),classCode:classCode});
    
export const quizDetail = (classQuizSetId) =>
    client.get(`/quizsets/class/${classQuizSetId}`);
    
export const deleteQuiz = (quizSetId) =>
    client.delete(`/quizsets/quizset/${quizSetId}`);
    
export const removeQuizFromClass = (quizSetId, classCode) =>
    client.delete(`/quizsets/quizset/${quizSetId}/class/${classCode}`);

export const quizTestSubmit = (quizset) =>
    client.post('/quizsets/score', quizset);

export const getQuizResult = (username) =>
    client.get(`/quizsets/result/users/${username}`)