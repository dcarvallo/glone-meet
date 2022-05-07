import {useState, useEffect, useRef} from 'react'
import { useAuth0 } from '@auth0/auth0-react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import Badge from '@mui/material/Badge';
import Grid from '@mui/material/Grid';
import GridViewIcon from '@mui/icons-material/GridView';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import {createLocalVideoTrack, createLocalAudioTrack, LocalVideoTrack } from 'twilio-video';
import Video from 'twilio-video';
import Participant from './Participant';
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
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import { getRoomToken } from "../scripts/getTokens";
import Slide from '@mui/material/Slide';
import { Card, CardMedia, Dialog, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
// let room 



const WaitingRoom = ({ roomOwner, roomName}) => {
  const grids = [
    {id: 1, src: '//www.gstatic.com/meet/layout_v2_sidebar_8dea1e0cfa750f5b3dc5b666daf8178d.svg', selected: true},
    {id: 2, src: '//www.gstatic.com/meet/layout_v2_tiled_b81dc04cf1f16260f8dc9b727c03a14e.svg', selected: false},
    {id: 3, src: '//www.gstatic.com/meet/layout_v2_fullscreen_9175b2e94ac960de3a29a4c5e4c32ab6.svg', selected: false},
  ]
  const {user} = useAuth0();
  const [count, setCount ] = useState(0);
  const [room, setRoom] = useState(null)
  const [participants, setParticipants] = useState([]);
  const enterAudio = useRef(null)
  const leaveAudio = useRef(null)
  const localVideo = useRef(null)
  const mainDiv = useRef(null)
  const [videoTrack, setVideoTrack] = useState([]);
  const localAudio = useRef(null)
  const [token, setToken] = useState(localStorage.getItem('twilio-token') || null)
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [micTootle, setMicToogle] = useState(true)
  const [videoToogle, setVideoToogle] = useState(true)
  const [shareToogle, setShareToogle] = useState(false)
  const [fullScreenToogle, setFullScreenToogle] = useState(false)
  const [showBadge, setShowBadge] = useState(true)
  const [openModalParticipant, setOpenModalParticipant] = useState(false)
  const [newParticipant, setNewParticipant] = useState(null)
  const [modalViews, setModalViews] = useState(false)
  const [gridView, setGridView] = useState(grids)
  const [gridViewSelected, setGridViewSelected] = useState(1)
  useEffect(() => {
    handleSubmit()
  },[])

  useEffect(() => {
      setCount(participants.length + 1 )
  },[participants])

  async function addLocalVideo () {

   
    const track2 = await createLocalVideoTrack()
    setVideoTrack(track2)
    track2.attach(localVideo.current)
  }

  const handleSubmit = async () => {

    let username = user.name
    if (!username) return alert('Please login first')
  
    try {
      await connect()
    } catch (e) {
      console.error(e)
      alert('Failed to connect')
      localStorage.removeItem('room')
      room.disconnect();
      window.location.reload()
    }
  }

  async function connect () {
    console.log(roomName)
    let supToken
    if(!token){
      supToken = await getRoomToken({username: JSON.stringify({name: user.name, roomOwner: roomOwner}), roomName})
      localStorage.setItem('twilio-token', supToken)
      setToken(token)
    }
    else supToken = token
      let room2 
      //En prueba para validar si existe camara disponible
      // navigator.getUserMedia({
      //   video: {}
      //   },
      //   async () => {
      //     room2 = await Video.connect(token)
      //     room2.participants.forEach(participantConnected)
      //     room2.on('participantConnected', participantConnected)
      //     room2.on('participantDisconnected', participantDisconnected)
      //     setRoom(room2)
          
      //     updateParticipantCount()
      //     setConnected(true)
      //     enterAudio.current.play();
      //     console.log({room2})
      //   },
      //   async () => {
      //     room2 = await Video.connect(token,{video : false})
      //     room2.participants.forEach(participantConnected)
      //     room2.on('participantConnected', participantConnected)
      //     room2.on('participantDisconnected', participantDisconnected)
      //     setRoom(room2)
          
      //     updateParticipantCount()
      //     setConnected(true)
      //     enterAudio.current.play();
          
      //   }
      // );

      // room2 = await Video.connect(token,{video : false, dominantSpeaker: true})
      room2 = await Video.connect(supToken, {dominantSpeaker: true})
      setRoom(room2)
      room2.participants.forEach(participantConnected)
      room2.on('participantConnected', participantConnected)
      room2.on('dominantSpeakerChanged', dominantParticipant);
      room2.on('participantDisconnected', participantDisconnected)
      room2.on('disconnected', () => {
        localStorage.removeItem('room')
        localStorage.removeItem('twilio-token')
        // room2.disconnect();
        // alert("You've been disconnected from the room")
        window.location.reload()
      });
      addLocalVideo()
      // updateParticipantCount()
      enterAudio.current.play();
      
  }
  
   function disconnect () {
    leaveAudio.current.play();
    setTimeout(() => {
      localStorage.removeItem('room')
      localStorage.removeItem('twilio-token')
      room.disconnect();
      window.location.reload()
    },1000)
    // updateParticipantCount()
  }
  
  function updateParticipantCount () {
    console.log('conteo participants')
    // setCount(prev => prev + 1)
    // setCount(participants.length + 1)
  }
  function dominantParticipant(participant){
    console.log('este es el participante dominante', participant)
    
  }
  
  function participantConnected (participant) {
   
    let usname = JSON.parse(participant.identity)
    console.log({usname})
    setParticipants(prev => [...prev, participant])
    setNewParticipant(usname.name)
    setOpenModalParticipant(true)
    // participant.tracks.forEach(localTrackPublication => {
    //   const {isSubscribed, track} = localTrackPublication
    //   if (isSubscribed) {
    //     attachTrack(track)
    //   }
    // })

    // console.log('entra dos veces?', participants)
    
    // participant.on('trackSubscribed', attachTrack)
    // participant.on('trackUnsubscribed', track => track.detach())
    
    // updateParticipantCount()
    
    
  }
  
  function attachTrack (track) {
    console.log({track})
    // const $video = $container.querySelector(`.participant:last-child .video`)
    // vid.current.appendChild(track.attach())
    // $container.appendChild(track.attach())
  }
  
  function participantDisconnected (participant) {
      setParticipants((prevParticipants) =>
        prevParticipants.filter((p) => p !== participant)
      );
  }

  async function shareScreen(){

    let screenTrack
    let room2 
    navigator.mediaDevices.getDisplayMedia().then( async (stream) => {
      screenTrack = new Video.LocalVideoTrack(stream.getTracks()[0]);
      room2 = room.localParticipant.publishTrack(screenTrack);
      
      let token = await getRoomToken({username: JSON.stringify({name: user.name + ' (share)', roomOwner: false}), roomName})
      Video.connect(token, {dominantSpeaker: true, tracks: [screenTrack]})
      
      // updateParticipantCount()
      enterAudio.current.play();

      let participant
      screenTrack.once('stopped', async (track) => {
        room.participants.forEach(participant2 => {
         participant2.videoTracks.forEach(tra => {
           if(tra.trackName == track.id ){ 
           participant = participant2
          } })
         console.log('participnate para desconectar',participant)

        })

        try {
          const response = await fetch('/removeParticipant', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              'roomName': roomName,
              'participantSid': participant.sid
            })
          });
      
          const data = await response.json();
          console.log('data from post server', data)
      
        } catch (error) {
          console.log(error)
        }
        setParticipants((prevParticipants) =>
          prevParticipants.filter((p) => p !== participant)
        );
      }); 

  }).catch(() => {
      alert('Could not share the screen.')
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
  
    if(JSON.parse(room.localParticipant.identity).roomOwner)
      setOpenModal(true)
    else{
      disconnect()
    }
  }

  function showChats(){
    setOpen(true)
    setShowBadge(true)
  }

  async function disconnectAll() {
    
    try {
      const response = await fetch('/roomDisconnect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          'roomName': roomName,
        })
      });
  
      const data = await response.json();
      disconnect();
  
    } catch (error) {
      console.log(error)
    }
  }

  function rejectParticipant() {
      setOpenModalParticipant(false)
  }

  async function aceptParticipant() {
      let room2 = await Video.connect(token)
      room2.participants.forEach(participantConnected)
      room2.on('participantConnected', participantConnected)
      room2.on('participantDisconnected', participantDisconnected)
      setRoom(room2)
      
      enterAudio.current.play();
  }

  function handleFullScreen(){
    setFullScreenToogle(prev => !prev)
    fullScreenToogle && document.fullscreenElement ? document.exitFullscreen() : mainDiv.current.requestFullscreen()
  }

  async function changeView(id){
    videoTrack.stop()
    console.log(localVideo)
    setGridViewSelected(id)
    setGridView(prev => prev.map( el => el.id == id ? {...el, selected : true} : {...el, selected : false} ))
    
    const track2 = await createLocalVideoTrack()
    setVideoTrack(track2)
    track2.attach(localVideo.current)
  }
  
  return (
    <Box style={{height: '87vh'}}>
      <audio ref={enterAudio} src='https://www.gstatic.com/meet/sounds/join_call_6a6a67d6bcc7a4e373ed40fdeff3930a.ogg'></audio>
    <audio ref={leaveAudio} src='https://www.gstatic.com/meet/sounds/leave_call_bfab46cf473a2e5d474c1b71ccf843a1.ogg'></audio>
    {gridViewSelected === 1 && 
    
     <Grid  ref={mainDiv} container spacing={2} padding={2}>
      
      <Grid item xs={12}  sm={participants.length == 0 ? 12 : 9}>
        <div id="local" className="participant">
            <Box sm={{height:  "90vh"}} xs={{height:  "60vh"}} style={{position: 'relative', display: 'flex', justifyContent: 'center'}}>

              <video onDoubleClick={handleFullScreen} ref={localVideo}  style={{  width: '100%', objectFit: "cover", borderRadius:"7px", position: 'relatve'}} autoPlay={videoToogle} />
              <p style={{position: 'absolute', bottom: '-15px', zIndex:'9'}} >{user.name}</p>
              <Box onClick={() => setModalViews(true)} style={{position: 'absolute', top: '7px', right: '7px',zIndex:'9'}}>
               <IconButton  style={{backgroundColor: 'white'}} > <GridViewIcon /> </IconButton>
              </Box>
              <audio ref={localAudio} autoPlay={false} muted={micTootle} />
              <div style={{ display: 'flex', justifyContent: 'center', gap: '7px', position: 'absolute', margin: '0 auto', bottom:'25px'}}>

                <Tooltip title="Audio On/Off"><IconButton style={micTootle ? {backgroundColor: 'white'} : {backgroundColor: 'red'}} onClick={handleMic}>{micTootle ? <MicIcon /> : <MicOffIcon />}</IconButton></Tooltip>
                <Tooltip title="Video On/Off"><IconButton style={videoToogle ? {backgroundColor: 'white'} : {backgroundColor: 'red'}} onClick={handleVideo}>{videoToogle ? <VideocamIcon /> : <VideocamOffIcon />}</IconButton></Tooltip>
                <Tooltip title="Share Screen"><IconButton style={shareToogle ? {backgroundColor: 'red'} : {backgroundColor: 'white'}} onClick={shareScreen}>{shareToogle ? <PresentToAllIcon /> : <CancelPresentationIcon />}</IconButton></Tooltip>
                <Tooltip title="Chat"><IconButton style={{backgroundColor: 'white'}} onClick={showChats}><Badge color="primary" variant="dot" badgeContent=" " invisible={showBadge} ><ChatIcon /></Badge></IconButton></Tooltip>
                <Tooltip title="Disconnect"><IconButton style={{backgroundColor: 'red'}} onClick={handleDisconnect}><PhoneDisabledIcon /></IconButton></Tooltip>
                <Tooltip title="Full Screen"><IconButton style={{backgroundColor: 'white'}} onClick={handleFullScreen}>{ fullScreenToogle ? <FullscreenExitIcon /> : <FullscreenIcon />}</IconButton></Tooltip>
              </div>
            </Box>           
            <Typography>{count} online users in - {roomName}</Typography>
          </div>
      </Grid>
      <Grid item xs={12}  sm={3}>
        <Stack direction={{ xs: 'row', sm: 'column' }} style={{ maxHeight: '92vh',overflow: 'auto'}} spacing={2}>         
            {participants.length > 0 &&
              participants.map(participant =>  (
                <Participant 
                  style={{cursor: 'pointer'}}
                  key={participant.sid}
                  participant={participant}
                  />
                  ))
                }
        </Stack>
    </Grid>
    <SideBar room={roomName} setShowBadge={setShowBadge} open={open} setOpen={setOpen} />

  </Grid>
  }

  { gridViewSelected === 2 && 
    <Grid container spacing={2} padding={2}>
               <Grid item gap={2} md={3}>
                <div style={{position:'relative', borderRadius: '10px', backgroundColor: "#585858", padding: '4px 4px 0 3px'}} sx={{width: '200px'}}>
                  <video onDoubleClick={handleFullScreen} ref={localVideo} style={{ height:"150px", width: '100%', objectFit: "cover", borderRadius:"10px", position: 'relatve'}} autoPlay={true} />
                  <p style={{position: 'absolute', left: '5px', bottom: '-8px', zIndex:'9'}} >{user.name}</p>
                </div>
              </Grid>
                
            {participants.length > 0 && 
              participants.map(participant =>  (
                
                <Grid item gap={2} md={3}>
                <Participant
                 style={{cursor: 'pointer'}}
                  key={participant.sid}
                  participant={participant}
                  />
                
                </Grid>
                  ))
                }


                 <div style={{wodth: "100%", display: 'flex', justifyContent: 'center', gap: '7px', position: 'absolute', margin: '0 auto', bottom:'25px'}}>

                  <Tooltip title="Audio On/Off"><IconButton style={micTootle ? {backgroundColor: 'white'} : {backgroundColor: 'red'}} onClick={handleMic}>{micTootle ? <MicIcon /> : <MicOffIcon />}</IconButton></Tooltip>
                  <Tooltip title="Video On/Off"><IconButton style={videoToogle ? {backgroundColor: 'white'} : {backgroundColor: 'red'}} onClick={handleVideo}>{videoToogle ? <VideocamIcon /> : <VideocamOffIcon />}</IconButton></Tooltip>
                  <Tooltip title="Share Screen"><IconButton style={shareToogle ? {backgroundColor: 'white'} : {backgroundColor: 'red'}} onClick={shareScreen}>{shareToogle ? <PresentToAllIcon /> : <CancelPresentationIcon />}</IconButton></Tooltip>
                  <Tooltip title="Chat"><IconButton style={{backgroundColor: 'white'}} onClick={showChats}><Badge color="primary" variant="dot" badgeContent=" " invisible={showBadge} ><ChatIcon /></Badge></IconButton></Tooltip>
                  <Tooltip title="Disconnect"><IconButton style={{backgroundColor: 'red'}} onClick={handleDisconnect}><PhoneDisabledIcon /></IconButton></Tooltip>
                  <Tooltip title="Full Screen"><IconButton style={{backgroundColor: 'white'}} onClick={handleFullScreen}>{ fullScreenToogle ? <FullscreenExitIcon /> : <FullscreenIcon />}</IconButton></Tooltip>
                  </div>
                  <Box onClick={() => setModalViews(true)} style={{position: 'absolute', top: '7px', right: '7px',zIndex:'9'}}>
               <IconButton  style={{backgroundColor: 'white'}} > <GridViewIcon /> </IconButton>
              </Box>
              
                
    </Grid>
  }

  {
        roomOwner &&
          <Dialog
          style={{padding: '10px'}}
            open={openModalParticipant}
            PaperProps={{ sx: { position: "fixed", top: 15, m: 0, p: '18px' ,height: '200px'} }}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            {/* <DialogTitle id="alert-dialog-title">
              {"New Participant"}
            </DialogTitle> */}
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                <h3>New Participant</h3>
              { newParticipant && <p> {newParticipant} wants to enter the room</p> }
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button color="primary" onClick={rejectParticipant}>Reject</Button>
              <Button color="secondary" onClick={aceptParticipant} autoFocus>
                Accept
              </Button>
            </DialogActions>
          </Dialog>
      }
      <ModalView openModal={openModal} setOpenModal={setOpenModal}>
            <Typography color="black"> Quieres finalizar la llamada? </Typography>
          <Box dense style={{display:'flex', gap: '5px'}}>
            <Button size="small" onClick={disconnect}>Abandonar la llamada</Button>
            <Button size="small" color="secondary" onClick={disconnectAll}>Finalizar la llamada para todos</Button>
          </Box>
      </ModalView>
      <ModalView openModal={modalViews} setOpenModal={setModalViews}>
            <Typography color="black"> Cambiar la modalidad de la vista </Typography>
          <div dense style={{width: '100%', display:'flex', gap: '20px'}}>
              {gridView.map(el => (
                <Card key={el.id} className={el.selected && 'viewSelection' } style={el.selected ? {border: '2px solid', borderColor: 'green', cursor: 'pointer', width: '600px'} : {cursor:'pointer', width: '600px'}}>
                
                <CardMedia
                  component="img"
                  width="100%"
                  image={el.src}
                  onClick={() => changeView(el.id)}
                  />
                </Card>
              ))}
              
          </div>
      </ModalView>

  </Box>
    
  );
};

const styles = {
  vistaSeleccionada : {
    
  }
}

export default WaitingRoom