import React,{useState, Fragment} from 'react';
import {Col, Row, OverlayTrigger, Tooltip} from 'react-bootstrap';


const renderTooltip = (props) => {
    return (
      <Tooltip id="button-tooltip" {...props}>
        {props}
      </Tooltip>
    );
  }

const UserClassItem = (props) =>{
    const {classInfo} = props;
    const [className, setClassName] = useState(classInfo.class_code);
    const [classCode, setClassCode] = useState(classInfo.class_name);

    // useEffect (()=>{
    //     if(className.length > 9){
    //         setClassName(className.slice(0,6) + "...");
    //     }
    //     if(classCode.length>9){
    //         setClassCode(classCode.slice(0,6)+"...");
    //     }
    // }, []);


    const truncatechars = (text)=>{
        if(text.length > 9){
            return text.slice(0,6)+"...";
        }
        return text;
    }

    return (
        <Fragment>
        <Row >
            <OverlayTrigger
            placement="top"
            delay={{ show: 250, hide: 400 }}
            overlay={renderTooltip(className)}
            >
            <Col md={12} xs={5} lg={5}>
            {truncatechars(className)}
            </Col>
            </OverlayTrigger>
            <OverlayTrigger
            placement="top"
            delay={{ show: 250, hide: 400 }}
            overlay={renderTooltip(classCode)}
            >
            <Col md={12} xs={5} lg={5}>
            {truncatechars(classCode)}
            </Col>
            </OverlayTrigger>
            <Col md={12} xs={2} lg={2} onClick={props.onClick} className="hover__pointer">
            <span role="img" aria-label="classroom">🏫</span>
            </Col>
        </Row>
        <hr className="profile__class__hr"/>
        </Fragment>
    );
}

export default UserClassItem;