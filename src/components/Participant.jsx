import React, { useState, useEffect, useRef } from "react";

const Participant = ({ participant, videoToogle, audioToogle }) => {
  const [videoTracks, setVideoTracks] = useState([]);
  const [audioTracks, setAudioTracks] = useState([]);
  

  const videoRef = useRef();
  const audioRef = useRef();

  const trackpubsToTracks = (trackMap) =>
    Array.from(trackMap.values())
      .map((publication) => publication.track)
      .filter((track) => track !== null);

  useEffect(() => {
      setVideoTracks(trackpubsToTracks(participant.videoTracks));
      setAudioTracks(trackpubsToTracks(participant.audioTracks));
    

    const trackSubscribed = (track) => {
      if (track.kind === "video") {
        console.log('algo cambio')
        setVideoTracks((videoTracks) => [...videoTracks, track]);
      } else if (track.kind === "audio") {
        setAudioTracks((audioTracks) => [...audioTracks, track]);
      }
    };
      
    const trackUnsubscribed = (track) => {
      if (track.kind === "video") {
        setVideoTracks((videoTracks) => videoTracks.filter((v) => v !== track));
      } else if (track.kind === "audio") {
        setAudioTracks((audioTracks) => audioTracks.filter((a) => a !== track));
      }
    };

    participant.on("trackSubscribed", trackSubscribed);
    participant.on("trackUnsubscribed", trackUnsubscribed);

    return () => {
      setVideoTracks([]);
      setAudioTracks([]);
      participant.removeAllListeners();
    };
  }, [participant]);

  useEffect(() => {
    const videoTrack = videoTracks[0];
    if (videoTrack) {
      videoTrack.attach(videoRef.current);
      return () => {
        videoTrack.detach();
      };
    }
  }, [videoTracks]);

  useEffect(() => {
    const audioTrack = audioTracks[0];
    if (audioTrack) {
      audioTrack.attach(audioRef.current);
      return () => {
        audioTrack.detach();
      };
    }
  }, [audioTracks]);

  return (
    <div className="participant">
      {/* <h5 style={{margin: "0"}}>{participant.identity}</h5> */}
      <div style={{position:'relative'}} sx={{width: '200px'}}>
        <video ref={videoRef} style={{ width: '100%', height:"150px", objectFit: "cover", position: 'relative',borderRadius:"10px"}} autoPlay={true} />
        <p style={{position: 'absolute', left: '5px', bottom: '-8px', zIndex:'9'}} >{participant.identity}</p>
      </div>
      <audio ref={audioRef} autoPlay={true} muted={false} />
      
    </div>
  );
};

export default Participant;