import React, {useState} from "react";
import {useHistory} from 'react-router-dom';
import {Container, Col,Row, Button, ButtonGroup, Dropdown, FormControl} from 'react-bootstrap';
import { useRecoilValue } from "recoil";
import {managingClasses, auth} from '../atoms';
import {addQuiz2Class} from '../../lib/api/quiz';

const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <Dropdown.Toggle
    size="sm"
      variant="outline-info"
      href=""
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

const QuizSetItem = ({quizset, user,auth,itemStyle}) => {
    const classes = useRecoilValue(managingClasses);
    const history = useHistory();
    return (
    <Container className={itemStyle}>

    <Row>
    <Col xs={6}>
    <h2>{quizset.quiz_set_id}</h2>
    <h5>{quizset.quiz_set_name}</h5>
    </Col>
    <Col xs={6} className="quizItem__btn__container">
    <div>
    {auth &&
    
        <Dropdown>
        <Dropdown.Toggle as={CustomToggle}>
        강의 +
        </Dropdown.Toggle>
        <Dropdown.Menu as={CustomMenu}>
        {
            classes.map((c,index)=><Dropdown.Item onClick={()=>addQuiz2Class(quizset.quiz_set_id, c.class_code)}
            eventKey={index}>{c.class_name}</Dropdown.Item>)
        }
        </Dropdown.Menu>
        </Dropdown>
        
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
        <Button size="sm" onClick={()=>history.push(`/quiz/${quizset.quiz_set_id}`)}>퀴즈풀기</Button>
    }
    <Button size="sm" onClick={()=>history.push(`/quiz/${quizset.quiz_set_id}/result`)}>결과보기</Button>
    </ButtonGroup>
    </div>
    </Col>
    </Row>
    </Container>
    )
}

export default QuizSetItem;