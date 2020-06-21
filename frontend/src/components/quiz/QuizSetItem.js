import React, {useState, Fragment} from "react";
import {useHistory} from 'react-router-dom';
import {Container, Col,Row, Badge,Button, ButtonGroup, Dropdown, FormControl} from 'react-bootstrap';
import { useRecoilValue } from "recoil";
import {managingClasses, auth} from '../atoms';
import {addQuiz2Class, removeQuizFromClass, deleteQuiz} from '../../lib/api/quiz';

const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <Dropdown.Toggle
    size="sm"
      variant="outline-info"
      href=""
      alignRight
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
    >
      {children}
    </Dropdown.Toggle>
  ));
  
  // forwardRef again here!
  // Dropdown needs access to the DOM of the Menu to measure it
  const CustomMenu = React.forwardRef(
    ({ children, style, onClick, className, 'aria-labelledby': labeledBy }, ref) => {
      const [value, setValue] = useState('');
  
      return (
        <div
          ref={ref}
          style={style}
          className={className}
          aria-labelledby={labeledBy}
        >
          <FormControl
            autoFocus
            className="mx-3 my-2 w-auto"
            placeholder="Type to filter..."
            onChange={(e) => setValue(e.target.value)}
            value={value}
          />
          <ul className="list-unstyled">
            {React.Children.toArray(children).filter(
              (child) =>
                !value || child.props.children.toLowerCase().startsWith(value),
            )}
          </ul>
        </div>
      );
    },
  );

const QuizSetItem = ({quizset, user,auth,itemStyle, class_code}) => {
    const classes = useRecoilValue(managingClasses);
    const history = useHistory();
    return (
    <Container className={itemStyle}>

    <Row>
    <Col xs={6}>
    <h5><Badge variant="secondary">{quizset.quiz_set_id || quizset.class_quiz_set_id}</Badge></h5>
    <h5>{quizset.quiz_set_name}</h5>
    </Col>
    <Col xs={6} className="quizItem__btn__container">
    <div className="quiz__auth_btn__container">
    {auth &&
      <Fragment>
      
      <Dropdown>
      <Dropdown.Toggle   as={CustomToggle}>
      강의 +
      </Dropdown.Toggle>
      <Dropdown.Menu alignRight as={CustomMenu}>
      {
        (classes !== null) && 
        classes.map((c,index)=><Dropdown.Item onClick={()=>{addQuiz2Class(quizset.quiz_set_id, c.class_code); alert(`${c.class_code} 강의에 추가되었습니다.`)}}
        eventKey={index}>{c.class_name}</Dropdown.Item>)
      }
      </Dropdown.Menu>
      </Dropdown>
      <Dropdown alignRight>
        <Dropdown.Toggle size="sm" variant="outline-danger">
        Action
        </Dropdown.Toggle>
        <Dropdown.Menu alignRight>
        {quizset.class_quiz_set_id && 
          <Dropdown.Item onClick={()=>removeQuizFromClass(quizset.quiz_set_id,class_code)}>강의에서 제거</Dropdown.Item>
        }
        <Dropdown.Item onClick={()=>deleteQuiz(quizset.quiz_set_id)}>퀴즈 완전 삭제</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>   
      </Fragment>
        
    }
    </div>
    <div>
    </div>
    <div>
    <ButtonGroup>
    {
        quizset.quiz_set_author_name === user && auth &&
        <Button size="sm">수정하기</Button>
    }
    {
        !auth && 
        <Button size="sm" onClick={()=>history.push({pathname:`/quiz/${quizset.class_quiz_set_id}`, state:{quizset:quizset}})}>퀴즈풀기</Button>
    }
    <Button size="sm" onClick={()=>history.push({pathname:`/quiz/${quizset.quiz_set_name}/result`,state:{quizset:quizset}})}>결과보기</Button>
    </ButtonGroup>
    </div>
    </Col>
    </Row>
    </Container>
    )
}

export default QuizSetItem;