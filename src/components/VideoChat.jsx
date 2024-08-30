import React, { useEffect, useRef, useState } from 'react';
import Peer from 'simple-peer';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const VideoChat = ({ roomId }) => {
  const [stream, setStream] = useState(null);
  const [peers, setPeers] = useState([]);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [videoDevices, setVideoDevices] = useState([]);
  const [audioDevices, setAudioDevices] = useState([]);
  const [selectedVideoDevice, setSelectedVideoDevice] = useState('');
  const [selectedAudioDevice, setSelectedAudioDevice] = useState('');
  const userVideo = useRef();
  const peersRef = useRef([]);

  useEffect(() => {
    getDevices();
    startStream();
  }, []);

  const getDevices = async () => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    setVideoDevices(devices.filter(device => device.kind === 'videoinput'));
    setAudioDevices(devices.filter(device => device.kind === 'audioinput'));
  };

  const startStream = async () => {
    const constraints = {
      video: selectedVideoDevice ? { deviceId: { exact: selectedVideoDevice } } : true,
      audio: selectedAudioDevice ? { deviceId: { exact: selectedAudioDevice } } : true,
    };

    try {
      const newStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(newStream);
      userVideo.current.srcObject = newStream;
    } catch (err) {
      console.error("Error accessing media devices:", err);
    }
  };

  useEffect(() => {
    if (selectedVideoDevice || selectedAudioDevice) {
      startStream();
    }
  }, [selectedVideoDevice, selectedAudioDevice]);

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
        <Select onValueChange={(value) => setSelectedVideoDevice(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select camera" />
          </SelectTrigger>
          <SelectContent>
            {videoDevices.map((device) => (
              <SelectItem key={device.deviceId} value={device.deviceId}>
                {device.label || `Camera ${device.deviceId.substr(0, 5)}`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select onValueChange={(value) => setSelectedAudioDevice(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select microphone" />
          </SelectTrigger>
          <SelectContent>
            {audioDevices.map((device) => (
              <SelectItem key={device.deviceId} value={device.deviceId}>
                {device.label || `Microphone ${device.deviceId.substr(0, 5)}`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
