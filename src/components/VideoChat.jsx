import React, { useEffect, useRef, useState } from 'react';
import Peer from 'simple-peer';

const VideoChat = ({ roomId }) => {
  const [stream, setStream] = useState(null);
  const [peers, setPeers] = useState([]);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const userVideo = useRef();
  const peersRef = useRef([]);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        setStream(stream);
        userVideo.current.srcObject = stream;
      });

    // Here you would typically connect to your signaling server
    // and handle room joining logic
  }, []);

  const createPeer = (partnerID, stream) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });

    peer.on('signal', signal => {
      // Send this signal to the partner through your signaling server
    });

    return peer;
  };

  const addPeer = (incomingSignal, callerID, stream) => {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });

    peer.on('signal', signal => {
      // Send this signal back to the caller through your signaling server
    });

    peer.signal(incomingSignal);

    return peer;
  };

  const toggleCamera = () => {
    if (stream) {
      stream.getVideoTracks().forEach(track => track.enabled = !isCameraOn);
      setIsCameraOn(!isCameraOn);
    }
  };

  const toggleMic = () => {
    if (stream) {
      stream.getAudioTracks().forEach(track => track.enabled = !isMicOn);
      setIsMicOn(!isMicOn);
    }
  };

  return (
    <div className="video-chat">
      <video playsInline muted ref={userVideo} autoPlay />
      {peers.map((peer, index) => (
        <Video key={index} peer={peer} />
      ))}
      <div className="controls">
        <button onClick={toggleCamera}>
          {isCameraOn ? 'Turn Camera Off' : 'Turn Camera On'}
        </button>
        <button onClick={toggleMic}>
          {isMicOn ? 'Turn Mic Off' : 'Turn Mic On'}
        </button>
      </div>
    </div>
  );
};

const Video = ({ peer }) => {
  const ref = useRef();

  useEffect(() => {
    peer.on('stream', stream => {
      ref.current.srcObject = stream;
    });
  }, [peer]);

  return <video playsInline autoPlay ref={ref} />;
};

export default VideoChat;