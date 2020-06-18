import {atom} from 'recoil'

const isAuthenticated = atom({
    key:'isAuthenticated',
    default: false
})
const tokenExpiredate = atom({
    key:'tokenExpiredate',
    default: 0
})

const currentUser = atom({
    key:'currentUser',
    default: null
})
const currentUserInfo = atom({
    key:'currentUserInfo',
    default: {
        "email": "",
        "nickname": "",
        "professor": false,
        "student_code": null,
        "username": ""
      }
})

const userAvatar = atom({
    key:'userAvatar',
    default: "https://avatars0.githubusercontent.com/u/5909549?v=4"
})

const userAuth = atom({
    key:'userAuth',
    default: false
})

const modalShow = atom({
    key: 'modalShow',
    default: false
})

const managingClasses = atom({
    key:'managingClasses',
    default: []
})

export {currentUserInfo, managingClasses, isAuthenticated, currentUser, userAvatar, userAuth, modalShow, tokenExpiredate}