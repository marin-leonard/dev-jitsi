import React from "react";
import { Button, Container, Row } from "react-bootstrap";

const VideoConference = ({ api, callApi }) => {
  const jitsiContainerId = "jitsi-container-id";
  const [jitsi, setJitsi] = React.useState({});

  const [studentsAsking, setStudentsAsking] = React.useState([]);
  const [studentsOnStage, setStudentsOnStage] = React.useState([]);

  const roomName = "15563154"

  const loadJitsiScript = () => {
    let resolveLoadJitsiScriptPromise = null;

    const loadJitsiScriptPromise = new Promise((resolve) => {
      resolveLoadJitsiScriptPromise = resolve;
    });

    const script = document.createElement("script");
    script.src = "https://meet.jit.si/external_api.js";
    script.async = true;
    script.onload = resolveLoadJitsiScriptPromise
    document.body.appendChild(script);

    return loadJitsiScriptPromise;
  };

  const initialiseJitsi = async () => {
    if (!window.JitsiMeetExternalAPI) {
      await loadJitsiScript();
    }

    const _jitsi = new window.JitsiMeetExternalAPI("meet.jit.si", {
      parentNode: document.getElementById(jitsiContainerId),
      roomName: roomName
    });

    setJitsi(_jitsi)
  };

  React.useEffect(() => {
    initialiseJitsi();

    return () => jitsi?.dispose?.();
  }, []);

  React.useEffect(() => {
    console.log("Call API :", api)
    if (api?.message === "mount") {
      setStudentsAsking([ ...studentsAsking, {id: api.id, name: api.name}])
    }
  }, [api]);
  
  const acceptMount = (_id) => {
    const student = studentsAsking.find(item => item.id === _id)
    callApi({ message: "accept", id: student.id, room_name: roomName })
    setStudentsOnStage([ ...studentsOnStage, student ])
    setStudentsAsking(studentsAsking.filter(item => item.id !== _id))
  }

  const refuseMount = (_id) => {
    const student = studentsAsking.find(item => item.id === _id)
    callApi({ message: "refuse", id: student.id })
    setStudentsAsking(studentsAsking.filter(item => item.id !== _id))
  }

  const kickStudent = (_id) => {
    const student = studentsOnStage.find(item => item.id === _id)
    callApi({ message: "kick", id: student.id })
    setStudentsOnStage(studentsOnStage.filter(item => item.id !== _id))
  }

  const studentMounting = (_id) => {
    const student = studentsAsking.find(item => item.id === _id)
    return (
      <Container>
        Student {student.name} wants to mount. Authorize him ?
        <Row>
          <Button onClick={() => acceptMount(_id)} className="bg-success mx-2">Yes</Button>
          <Button onClick={() => refuseMount(_id)} className="bg-danger mx-2">No</Button>
        </Row>
      </Container>
    )
  }
  const studentOnStream = (_id) => {
    const student = studentsOnStage.find(item => item.id === _id)
    return (
      <Container>
        <Row>
          Student {student.name} is on stream.
          <Button onClick={() => kickStudent(_id)} className="bg-danger mx-2">Kick</Button>
        </Row>
      </Container>
    )
  }

  return (
    <div>
      <div id={jitsiContainerId} style={{ height: 720, width: "100%" }} />
      <Button className="mx-2" onClick={() => jitsi.executeCommand('startRecording', {
        mode: 'stream',
        youtubeStreamKey: 'xpye-7p9g-rgwr-1xhd-9dz7',
      })}>Launch Stream</Button>
      <Button className="mx-2" onClick={() => jitsi.executeCommand('stopRecording', {
        mode: 'stream'
      })}>Stop Stream</Button>
      {studentsAsking.map(item => studentMounting(item.id))}
      {studentsOnStage.map(item => studentOnStream(item.id))}
    </div>
  );
};

export default VideoConference;