import {atom} from 'recoil'

const isAuthenticated = atom({
    key:'isAuthenticated',
    default: false
})

const currentUser = atom({
    key:'currentUser',
    default: null
})

const userAvatar = atom({
    key:'userAvatar',
    default: "https://avatars0.githubusercontent.com/u/5909549?v=4"
})

const userAuth = atom({
    key:'userAuth',
    default: false
})

export {isAuthenticated, currentUser, userAvatar, userAuth}