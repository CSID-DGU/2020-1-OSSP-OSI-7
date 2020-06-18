import React from 'react';
import {Container, Col,Row} from 'react-bootstrap';
import {useRecoilValue} from 'recoil';
import {currentUser, currentUserInfo, userAvatar,userAuth, modalShow} from '../atoms';
import MypageRight from './MypageRight';
import MypageLeft from './MypageLeft';


const Mypage = () =>{
    const avatar = useRecoilValue(userAvatar);
    const user = useRecoilValue(currentUser);
    const auth = useRecoilValue(userAuth);
    const isModal = useRecoilValue(modalShow);
    const userInfo = useRecoilValue(currentUserInfo);

    // useEffect(()=>{
        // getAvatar(user).then((res)=>setAvatar(res.data.avatar_url));
    // }, [user])

    return (
        <Container className={`quiz__container__no_border ${isModal&& " modal_blur"}`}   as={Col} md={{ span: 10, offset: 1 }}>
            <Row>
                <Col md={3}>
                <MypageLeft avatar={avatar} userInfo={userInfo} user={user}/>
                </Col>
                <Col md={9}>
                <MypageRight auth={auth}/>
                </Col>
            </Row>
        </Container>
    )
}

export default Mypage;