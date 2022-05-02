import {useState, useEffect, useRef} from 'react'
import { useAuth0 } from '@auth0/auth0-react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import {createLocalVideoTrack, createLocalAudioTrack, LocalVideoTrack } from 'twilio-video';
import Video from 'twilio-video';
import Participant from './Participant';
import ChatComponent from './ChatComponent';
import ModalView from './ModalView';
import SideBar from './SideBar';
import MicIcon from '@mui/icons-material/Mic';
import ChatIcon from '@mui/icons-material/Chat';
import VideocamIcon from '@mui/icons-material/Videocam';
import MicOffIcon from '@mui/icons-material/MicOff';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import IconButton from '@mui/material/IconButton';
import PresentToAllIcon from '@mui/icons-material/PresentToAll';
import CancelPresentationIcon from '@mui/icons-material/CancelPresentation';
import PhoneDisabledIcon from '@mui/icons-material/PhoneDisabled';
import { getRoomToken } from "../scripts/getTokens";


// let room 
const WaitingRoom = ({roomName}) => {

 
  const {isAuthenticated, isLoading, user} = useAuth0();
  const [count, setCount ] = useState(0);
  const [room, setRoom] = useState(null)
  const [connected, setConnected] = useState(false)
  const [participants, setParticipants] = useState([]);
  const vid = useRef(null)
  const localVideo = useRef(null)
  const [videoTrack, setVideoTrack] = useState([]);
  const localAudio = useRef(null)
  const [token, setToken] = useState(null)
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [micTootle, setMicToogle] = useState(false)
  const [videoToogle, setVideoToogle] = useState(false)
  const [shareToogle, setShareToogle] = useState(false)

  useEffect(() => {
    addLocalVideo()
    handleSubmit()
  },[])

  useEffect(() => {
      setCount(participants.length)
  },[participants])

  async function addLocalVideo () {
    const track2 = await createLocalVideoTrack()
    const audioTrack = await createLocalAudioTrack()
    setVideoTrack(track2)
    // localVideo.current.appendChild(track.attach())
    track2.attach(localVideo.current)
    // audioTrack.attach(localAudio.current)
  }

  const handleSubmit = async () => {

    if (connected) {
      await disconnect()
      return
    }
    let username = user.name
    if (!username) return alert('Please login first')
  
    try {
      await connect()
    } catch (e) {
      console.error(e)
  
      alert('Failed to connect')
    }
  }

  async function connect () {
    console.log(roomName)
    let token = await getRoomToken({username: user.name, roomName})
    setToken(token)
    let room2 = await Video.connect(token)
    room2.participants.forEach(participantConnected)
    room2.on('participantConnected', participantConnected)
    room2.on('participantDisconnected', participantDisconnected)
    setRoom(room2)
    
    updateParticipantCount()
    setConnected(true)
  }
  
  async function disconnect () {
    localStorage.removeItem('room')
    room.disconnect();
    window.location.reload()
    setConnected(false)
    updateParticipantCount()
  }
  
  function updateParticipantCount () {
    
    setCount(prev => prev + 1)
    // setCount(participants.length + 1)
  }
  
  function participantConnected (participant) {
  
    participant.tracks.forEach(localTrackPublication => {
      const {isSubscribed, track} = localTrackPublication
      if (isSubscribed) {
        attachTrack(track)
      }
    })

    console.log('entra dos veces?')
    
    participant.on('trackSubscribed', attachTrack)
    participant.on('trackUnsubscribed', track => track.detach())
    updateParticipantCount()
    setParticipants(prev => [...prev, participant])
    console.log({'desde con':participants})
  }
  
  function attachTrack (track) {
    console.log({track})
    // const $video = $container.querySelector(`.participant:last-child .video`)
    // vid.current.appendChild(track.attach())
    // $container.appendChild(track.attach())
  }
  
  function participantDisconnected (participant) {
    // setParticipants(prev => [...prev, participant])
    console.log({'desde disco':participants})
    console.log('participant disconnected', participant)
    setParticipants([...participants])
  }



  async function shareScreen(){
    videoTrack.disable();
    const stream = await navigator.mediaDevices.getDisplayMedia({video: {frameRate: 15}});
    const screenTrack = new LocalVideoTrack(stream.getTracks()[0], {name:'myscreenshare'});
    // setShareToogle(true)
    
    screenTrack.attach(localVideo.current)

    connect({username: user.name +' (share)' });

    screenTrack.once('stopped', async () => {
      screenTrack.detach(localVideo.current);
      const track = await createLocalVideoTrack()
      track.attach(localVideo.current)
      setShareToogle(false)
    });
    
  }

  function handleVideo(){
    setVideoToogle(!videoToogle)

    room.localParticipant.videoTracks.forEach(track2 => {
      if(videoToogle){
        
        track2.track.disable()
        // track2.track.stop()
        videoTrack.stop()
       }
       else{
         if(videoTrack.isStopped){

           console.log({videoTrack})
           videoTrack.restart()
           track2.track.enable()
          }
       } 
    });

  }

  function handleMic() {
    setMicToogle(!micTootle)
    room.localParticipant.audioTracks.forEach(track2 => {
      micTootle ? track2.track.disable() : track2.track.enable()
    });
  }

  function handleDisconnect() {
    setOpenModal(true)
  }

  return (
    <Grid  container spacing={2}>
      
      <ModalView openModal={openModal} setOpenModal={setOpenModal}>
          Elija una opcion
          <div style={{display:'flex'}}>
            <Button variant='contained' onClick={disconnect}>Finalizar mio</Button>
            <Button variant='contained' onClick={disconnect}>Finalizar para todos</Button>
          </div>
      </ModalView>
      <Grid item xs={12} md={9}>
        <div  style={{ width: "100%"}} id="local" className="participant">
            <div style={{position: 'relative'}}>

              <video ref={localVideo} style={{ width:"100%", objectFit: "cover", borderRadius:"7px", position: 'relatve'}} autoPlay={videoToogle} />
              <p style={{position: 'absolute', left: '5px', bottom: '-10px', zIndex:'9'}} >{user.name}</p>
            
              <audio ref={localAudio} autoPlay={false} muted={micTootle} />
              <div style={{width: '100%', display: 'flex', justifyContent: 'center', position: 'absolute', margin: '0 auto', bottom:'25px'}}>

                <IconButton style={micTootle ? {backgroundColor: 'white'} : {backgroundColor: 'red'}} onClick={handleMic}>{micTootle ? <MicIcon /> : <MicOffIcon />}</IconButton>
                <IconButton style={videoToogle ? {backgroundColor: 'white'} : {backgroundColor: 'red'}} onClick={handleVideo}>{videoToogle ? <VideocamIcon /> : <VideocamOffIcon />}</IconButton>
                <IconButton style={shareToogle ? {backgroundColor: 'white'} : {backgroundColor: 'red'}} onClick={shareScreen}>{shareToogle ? <PresentToAllIcon /> : <CancelPresentationIcon />}</IconButton>
                <IconButton style={{backgroundColor: 'white'}} onClick={() => setOpen(true)}><ChatIcon /></IconButton>
                <IconButton style={{backgroundColor: 'red'}} onClick={handleDisconnect}><PhoneDisabledIcon /></IconButton>
              </div>
            </div>           
            <p>{count} online users</p>
          </div>
      </Grid>
      <Grid item xs={12} gap={2} md={3}>
        <Paper style={{ maxHeight: 500, backgroundColor: '#222222',overflow: 'auto'}}>         
          <div sx={{ display: 'flex', flexDirection: 'row'}}  style={{ display: 'flex', flexDirection: 'column'}}>
            {participants.length > 0 ? 
              participants.map(participant =>  (

                <Participant 
                  key={participant.sid}
                  participant={participant}
                  />
                  ))
                  : null
                }
          </div>
        </Paper>
    </Grid>

    <SideBar participants={participants} open={open} setOpen={setOpen} />

  </Grid>
    
  );
};

export default WaitingRoom