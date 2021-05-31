import React from "react";
import { Button, Container } from "react-bootstrap";

const StudentSide = ({ api, callApi, _id, _name }) => {

  const jitsiContainerId = "jitsi-container-id" + _id;
  const [jitsi, setJitsi] = React.useState({});
  const [onStage, setOnStage] = React.useState(false);
  const [roomName, setRoomName] = React.useState(null);

  const [refused, setRefused] = React.useState(false);
  const [accepted, setAccepted] = React.useState(false);
  const [asked, setAsked] = React.useState(false);

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
    console.log("Init Jitsi ", roomName)
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
    if (onStage === true) 
      initialiseJitsi();
  }, [onStage]);

  React.useEffect(() => {
    if (api?.message === "accept" && api?.id === _id) {
      setRoomName(api.room_name)
      setOnStage(true)
      setAccepted(true)
      setRefused(false)
      setAsked(false)
    } else if (api?.message === "refuse" && api?.id === _id) {
      setRefused(true)
      setAccepted(false)
      setAsked(false)
    } else if (api?.message === "kick" && api?.id === _id) {
      setOnStage(false)
      setRoomName(null)
      jitsi?.dispose?.();
      setRefused(false)
      setAccepted(false)
    }
  }, [api]);

  const leaveStream = () => {
    setOnStage(false)
    setRoomName(null)
    jitsi?.dispose?.();
    callApi({ message: "leave", id: _id})
    setRefused(false)
    setAccepted(false)
  }

  const askMount = () => {
    callApi({ message: "mount", id: _id, name: _name})
    setAsked(true)
    setRefused(false)
    setAccepted(false)
  }

  return (
    <Container fluid>
      {onStage && jitsi ?
        <div>
          <div id={jitsiContainerId} style={{ height: 720, width: "100%" }} />
          <Button onClick={() => leaveStream()}>Return to stream</Button>
        </div>
        : 
        <div>
          <iframe height="720" width="100%" src="https://www.youtube.com/embed/q74xHpFTO4I" frameborder="0" allowfullscreen></iframe>
          {asked ? <div>The teacher receive your demand. Waiting his reponse</div> : <Button onClick={() => askMount()}>Monter au tableau</Button>}
        </div>
      }
      {refused && <div>The teacher refuses your demand</div>}
      {accepted && <div>The teacher accepts your demand</div>}
    </Container>
  )
};

export default StudentSide;