import {atom} from 'recoil'

const isAuthenticated = atom({
    key:'isAuthenticated',
    default: false
})

const currentUser = atom({
    key:'currentUser',
    default: null
})

export {isAuthenticated, currentUser}