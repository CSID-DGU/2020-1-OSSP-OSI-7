import {atom} from 'recoil'

const authenticated = atom({
    key:'authenticated',
    default: false
})

const currentUser = atom({
    key:'currentUser',
    default: null
})

export {authenticated, currentUser}