import { Container, Row, Col } from 'react-bootstrap';
import React, { useState } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import VideoConference from './VideoConference';
import StudentSide from './StudentSide';

function App() {
  const [fakeApi, setFakeApi] = useState({})

  return (
    <Container fluid>
      <Row>
        <Col className="bg-success">
          <h4>Vue Professeur</h4>
          <VideoConference api={fakeApi} callApi={setFakeApi} />
        </Col>
        <Col className="bg-danger">
          <h4>Vue Etudiant</h4>
          <StudentSide api={fakeApi} callApi={setFakeApi} _id="student_1" _name="Marin Leonard"/>
        </Col>
        {/*<Col className="bg-danger">
          <h4>Vue Etudiant</h4>
          <StudentSide api={fakeApi} callApi={setFakeApi} _id="student_2" _name="Student 2"/>
        </Col>*/}
      </Row>
    </Container>
  );
}

export default App;
