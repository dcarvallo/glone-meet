import React, { useState, useEffect, useRef } from "react";
import Box from '@mui/material/Box';
import PanToolIcon from '@mui/icons-material/PanTool';
import { IconButton } from "@mui/material";
import MicOffIcon from '@mui/icons-material/MicOff';
import MaximizeContent from "./MaximizeContent";

const Participant = ({ participant, selectParticipant, fullScreenToogle,raiseHand,micsOff ,width}) => {
  const [videoTracks, setVideoTracks] = useState([]);
  const [audioTracks, setAudioTracks] = useState([]);

  const [isFull, setIsFull] = useState(false)
  
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
    <MaximizeContent isFull={isFull} setIsFull={setIsFull}>
      <div style={{cursor: 'pointer', width:'100%'}} className="participant">
        <Box style={{width: fullScreenToogle ? '90%' : '97%', position:'relative', borderRadius: '10px', backgroundColor: "#585858", padding: '4px 4px 0 3px'}} sx={{width: fullScreenToogle ?  '90%' : '250px'}}>
          <video ref={videoRef} style={{ width: isFull ? '95vw' : width , height: isFull ? "90vh": "150px", objectFit: "cover", position: 'relative',borderRadius:"10px"}} autoPlay={true} />
          <p style={{backgroundColor: 'rgba(0,0,0, .5)', padding:'5px' , borderRadius:'5px',position: 'absolute', left: '5px', bottom: '-8px', zIndex:'9'}} >
            
          {raiseHand.length > 0 && raiseHand.includes(participant.sid) && <IconButton style={{backgroundColor: 'transparent', color: 'yellow'}} ><PanToolIcon /> </IconButton> }
          {micsOff.length > 0 && micsOff.includes(participant.sid) && <IconButton style={{ color: 'red'}} ><MicOffIcon /> </IconButton> }
            {JSON.parse(participant.identity).name}
            </p>
        
        </Box>
        <audio ref={audioRef} autoPlay={true} muted={false} />

      
      </div>
      
    </MaximizeContent>
  );
};

export default Participant;