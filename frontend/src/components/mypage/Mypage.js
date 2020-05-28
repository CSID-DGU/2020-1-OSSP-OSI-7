import React from 'react';
import {useRecoilValue} from 'recoil';
import {currentUser} from '../atoms';


const Mypage = () =>{
    const user = useRecoilValue(currentUser);
    return (
        <div>
            {user}
        </div>
    )
}

export default Mypage;