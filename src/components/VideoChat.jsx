import React, { useEffect, useRef, useState } from 'react';
import Peer from 'simple-peer';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Video, VideoOff, Mic, MicOff } from 'lucide-react';

const VideoChat = ({ roomId }) => {
  const [stream, setStream] = useState(null);
  const [peers, setPeers] = useState([]);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [videoDevices, setVideoDevices] = useState([]);
  const [audioDevices, setAudioDevices] = useState([]);
  const [selectedVideoDevice, setSelectedVideoDevice] = useState('');
  const [selectedAudioDevice, setSelectedAudioDevice] = useState('');
  const [isCallStarted, setIsCallStarted] = useState(false);
  const userVideo = useRef();
  const peersRef = useRef([]);

  useEffect(() => {
    getDevices();
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
      setIsCallStarted(true);
    } catch (err) {
      console.error("Error accessing media devices:", err);
    }
  };

  useEffect(() => {
    if (isCallStarted && (selectedVideoDevice || selectedAudioDevice)) {
      startStream();
    }
  }, [selectedVideoDevice, selectedAudioDevice, isCallStarted]);

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
      {!isCallStarted ? (
        <Button onClick={startStream} className="mb-4">Start Call</Button>
      ) : (
        <>
          <video playsInline muted ref={userVideo} autoPlay className="w-full h-auto mb-4" />
          {peers.map((peer, index) => (
            <PeerVideo key={index} peer={peer} />
          ))}
          <div className="controls flex space-x-2 mb-4">
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
            <Button onClick={toggleCamera} variant="outline" size="icon">
              {isCameraOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
            </Button>
            <Button onClick={toggleMic} variant="outline" size="icon">
              {isMicOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

const PeerVideo = ({ peer }) => {
  const ref = useRef();

  useEffect(() => {
    peer.on('stream', stream => {
      ref.current.srcObject = stream;
    });
  }, [peer]);

  return <video playsInline autoPlay ref={ref} className="w-full h-auto mb-4" />;
};

export default VideoChat;
