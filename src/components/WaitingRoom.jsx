import {useState, useEffect, useRef} from 'react'
import { useAuth0 } from '@auth0/auth0-react';
import '../emojis.scss'
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import Badge from '@mui/material/Badge';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';

import {createLocalVideoTrack, createLocalAudioTrack, LocalVideoTrack } from 'twilio-video';
import Video from 'twilio-video';
import Participant from './Participant';
import SideBar from './SideBar';
import SidebarParticipants from './SidebarParticipants';
import MicIcon from '@mui/icons-material/Mic';
import ChatIcon from '@mui/icons-material/Chat';
import VideocamIcon from '@mui/icons-material/Videocam';
import MicOffIcon from '@mui/icons-material/MicOff';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import IconButton from '@mui/material/IconButton';

import PhoneDisabledIcon from '@mui/icons-material/PhoneDisabled';

import PeopleIcon from '@mui/icons-material/People';

import TagFacesIcon from '@mui/icons-material/TagFaces';

import { getRoomToken } from "../scripts/getTokens";
import { Backdrop, CircularProgress} from '@mui/material';
import OptionsMenu from './utils/OptionsMenu';
import EmojisMenu from './utils/EmojisMenu';
import ChangeViewModal from './ChangeViewModal';
import NewParticipantDialog from './NewParticipantDialog';
import DisconnectModal from './DisconnectModal';
import VideoLocal from './VideoLocal';
import Clock from './utils/Clock'

const grids = [
  {id: 1, src: '//www.gstatic.com/meet/layout_v2_sidebar_8dea1e0cfa750f5b3dc5b666daf8178d.svg', selected: true},
  {id: 2, src: '//www.gstatic.com/meet/layout_v2_tiled_b81dc04cf1f16260f8dc9b727c03a14e.svg', selected: false},
  // {id: 3, src: '//www.gstatic.com/meet/layout_v2_fullscreen_9175b2e94ac960de3a29a4c5e4c32ab6.svg', selected: false},
]
const WaitingRoom = ({ roomOwner, roomName}) => {
  
  const enterAudio = useRef(null)
  const leaveAudio = useRef(null)
  const localVideo = useRef(null)
  const mainDiv = useRef(null)
  const localAudio = useRef(null)
  
  const {user} = useAuth0();

  const [isConnected, setIsConnected] = useState(false)
  const [count, setCount ] = useState(0);
  const [room, setRoom] = useState(null)
  const [participants, setParticipants] = useState([]);
  const [videoTrack, setVideoTrack] = useState([]);
  const [token, setToken] = useState(localStorage.getItem('twilio-token') || null)
  const [open, setOpen] = useState(false);
  const [openParticipants, setOpenParticipants] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [micToogle, setMicToogle] = useState(true)
  const [videoToogle, setVideoToogle] = useState(true)
  const [shareToogle, setShareToogle] = useState(false)
  const [fullScreenToogle, setFullScreenToogle] = useState(false)
  const [showBadge, setShowBadge] = useState(true)
  const [openModalParticipant, setOpenModalParticipant] = useState(false)
  const [newParticipant, setNewParticipant] = useState([])
  const [modalViews, setModalViews] = useState(false)
  const [gridView, setGridView] = useState(grids)
  const [gridViewSelected, setGridViewSelected] = useState(1)
  const [emojisOpen, setEmojisOpen] = useState({open: false, anchorEl: null})
  const [optionsOpen, setOptionsOpen] = useState({open: false, anchorEl: null})
  const [emojisUser, setEmojisUser] = useState([])
  const [sendWait, setSendWait] = useState(false)
  const [dataTrack, setDataTrack] = useState(undefined)
  const [raiseHand, setRaiseHand] = useState([])
  const [micsOff, setMicsOff] = useState([])
  
  let otro;
  
  useEffect(() => {
    roomOwner &&  setIsConnected(true)
    addLocalData()
    handleSubmit()
  },[])

  useEffect(() => {
      setCount(participants.length + 1 )
  },[participants])

  async function addLocalVideo () {
    const track2 = await createLocalVideoTrack()
    setVideoTrack(track2)
    track2.attach(localVideo.current)
    localVideo.current.style.transform = 'scale(-1, 1)'
    
  }

  const handleSubmit = async () => {
    let username = user.name
    if (!username) return alert('Please login first')
  
    try {
      await connect()
    } catch (e) {
      console.error(e)
      localStorage.removeItem('room')
      localStorage.removeItem('twilio-token')
      alert('Failed to connect')
      room.disconnect();
      window.location.reload()
    }
  }

  function addLocalData() {
    const localDataTrack = new Video.LocalDataTrack();
    otro = localDataTrack
    setDataTrack(localDataTrack);
};
function sendDataToRoom(data){
  
  const randomPosition =  Math.floor(Math.random() * 100) + 0.95 + '%'
  !sendWait && dataTrack.send(JSON.stringify({
      component: data,
      user: user.name,
      time: 3000,
      position: randomPosition,
      sid: room.localParticipant.sid
    })); 
    setSendWait(true)
    setEmojisOpen({...emojisOpen, open: false})
    setTimeout(() => {
      setSendWait(false)
    }, 3000)
}

  async function connect () {
    // console.log(roomName)
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

      // room2 = await Video.connect(supToken,{video : false, dominantSpeaker: true})
      room2 = await Video.connect(supToken, {dominantSpeaker: true})
      console.log(room2.localParticipant)
      setRoom(room2)
      room2.localParticipant.publishTrack(otro);
      room2.on('participantConnected',participantConnected)
      room2.on('dominantSpeakerChanged', dominantParticipant);
      room2.on('participantDisconnected', participantDisconnected)
      room2.on('disconnected', () => {
        localStorage.removeItem('room')
        localStorage.removeItem('twilio-token')
        window.location.reload()
      });

      const dataTrackPublished = {};

      dataTrackPublished.promise = new Promise((resolve, reject) => {
        dataTrackPublished.resolve = resolve;
        dataTrackPublished.reject = reject;
      });

      room2.localParticipant.on('trackPublished', publication => {
        if (publication.track === dataTrack) {
          dataTrackPublished.resolve();
        }
      });

      room2.localParticipant.on('trackPublicationFailed', (error, track) => {
        if (track === dataTrack) {
          dataTrackPublished.reject(error);
        }
      });

      room2.on('trackSubscribed', track => {
      
        if (track.kind === 'data') {
          track.on('message', async data => {
            let temp = JSON.parse(data)
            
            
            if(temp.personalMic){
              setMicsOff(prev => prev.includes(temp.sid) ?  prev.filter(el => el !== temp.sid) : [...prev, temp.sid])
            }
            if(temp.disableMics){
              setMicToogle(!micToogle)
              room2.localParticipant.audioTracks.forEach(track2 => {
                micToogle ? track2.track.disable() : track2.track.enable()
              });
              return
            }
            if(!temp.connect){
              if(temp.component === 'hand'){
                setRaiseHand(prev => prev.includes(temp.sid) ?  prev.filter(el => el !== temp.sid) : [...prev, temp.sid] )
                return
              }
              setEmojisUser(prev => [...prev, temp])
            }
            else{
              
              if(isConnected){
                let arrParticipants = []
                room2.participants.forEach(participant => {
                  arrParticipants.push(participant)
                })
                setParticipants(...arrParticipants,...arrParticipants,...arrParticipants,...arrParticipants,...arrParticipants,...arrParticipants)
              }

              if(room2.localParticipant.sid == temp.sid){
                console.log('here its ok')
                let arrParticipants = []
                room2.participants.forEach(participant => {
                  arrParticipants.push(participant)
                })
                setParticipants(arrParticipants)
                setIsConnected(true)  
                const track2 = await createLocalVideoTrack()
                setVideoTrack(track2)
                track2.attach(localVideo.current)
                localVideo.current.style.transform = 'scale(-1, 1)'
              }
            }           
          });
        }
      });
      addLocalVideo()
      JSON.parse(room2.localParticipant.identity).roomOwner && setIsConnected(true)
      isConnected && enterAudio.current.play();
  }
  
   function disconnect () {
    leaveAudio.current && leaveAudio.current.play();
    setTimeout(() => {
      localStorage.removeItem('room')
      localStorage.removeItem('twilio-token')
      room.disconnect();
      window.location.reload()
    },1000)
  }
  
  function dominantParticipant(participant){
    // console.log('este es el participante dominante(Audio)', participant) 
  }
  
  function participantConnected (participant) {
    roomOwner && setOpenModalParticipant(true)
    let usdata = JSON.parse(participant.identity)
    if(usdata.roomOwner) {
      setParticipants(prev => [...prev, participant])
    }
    setNewParticipant(prev => [...prev, participant])
  }

  function acceptParticipant(participant) {
      enterAudio.current.play();
      dataTrack.send(JSON.stringify({
        connect: true,
        sid: participant.sid
      }));
      setParticipants(prev => [...prev, participant])
      setNewParticipant(prevParticipants => prevParticipants.filter((p) => p !== participant))
  }

  function acceptAll(){
    let all = []
    let deleteNew = [...newParticipant]
    deleteNew.forEach(participant => {
      dataTrack.send(JSON.stringify({
        connect: true,
        sid: participant.sid
      }));
      all.push(participant)
    })
    setParticipants(prev => [...prev, ...all])
    setNewParticipant([])
  }

  function participantDisconnected (participant) {
    setParticipants((prevParticipants) =>
      prevParticipants.filter((p) => p !== participant)
    );
  }

  function rejectParticipant() {
    removeParticipant(newParticipant[0])
    setOpenModalParticipant(false)
  }

  function disableMics(){
    dataTrack.send(JSON.stringify({
      disableMics: true,
    }));
  }

  async function shareScreen(){
    let screenTrack
    let room2 
    navigator.mediaDevices.getDisplayMedia().then( async (stream) => {
      screenTrack = new Video.LocalVideoTrack(stream.getTracks()[0]);
      room2 = room.localParticipant.publishTrack(screenTrack);
      let token = await getRoomToken({username: JSON.stringify({name: user.name + ' (share)', roomOwner: false}), roomName})
      Video.connect(token, {dominantSpeaker: true, tracks: [screenTrack]})
      enterAudio.current.play();
      let participant
      screenTrack.once('stopped', async (track) => {
        room.participants.forEach(participant2 => {
         participant2.videoTracks.forEach(tra => {
           if(tra.trackName == track.id ){ 
           participant = participant2
          } })
        })
        removeParticipant(participant)
      }); 
      setOptionsOpen({...optionsOpen, open: false})

  }).catch(() => {
      alert('Could not share the screen.')
  });

  }
  async function removeParticipant(participant){
    
    try {
      await fetch('/removeParticipant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          'roomName': roomName,
          'participantSid': participant.sid
        })
      });
  
      setParticipants((prevParticipants) =>
      prevParticipants.filter((p) => p !== participant)
      );
    } catch (error) {
      console.log(error)
    }
  }

  function handleVideo(){
    setVideoToogle(!videoToogle)
    room.localParticipant.videoTracks.forEach(track2 => {
      if(videoToogle){
        track2.track.disable()
        videoTrack.stop()
       }
       else{
         if(videoTrack.isStopped){
           videoTrack.restart()
           track2.track.enable()
          }
       } 
    });
  }

  function handleMic() {
    setMicToogle(!micToogle)
    room.localParticipant.audioTracks.forEach(track2 => {
      micToogle ? track2.track.disable() : track2.track.enable()
    });
     dataTrack.send(JSON.stringify({
      personalMic: true,
      sid: room.localParticipant.sid
    }));
  }

  function handleDisconnect() {
    JSON.parse(room.localParticipant.identity).roomOwner ? setOpenModal(true) : disconnect()
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
      disconnect();
    } catch (error) {
      console.log(error)
    }
  }

  function handleFullScreen(){
    setFullScreenToogle(prev => !prev)
    fullScreenToogle && document.fullscreenElement ? document.exitFullscreen() : mainDiv.current.requestFullscreen()
    setOptionsOpen({...optionsOpen, open: false})
  }

  async function changeView(id){
    videoTrack.stop()
    setGridViewSelected(id)
    setGridView(prev => prev.map( el => el.id == id ? {...el, selected : true} : {...el, selected : false} ))
    //esto agregue... cuidado
    
    // setParticipants(prev => {
    //   prev.unshift(room.localParticipant); 
    //   return prev
    })
    
    const track2 = await createLocalVideoTrack()
    setVideoTrack(track2)
    track2.attach(localVideo.current)
    localVideo.current.style.transform = 'scale(-1, 1)'
  }
  function selectParticipant(id){
    handleFullScreen()
  }

  function openEmojisMenu(event){
    setEmojisOpen({...emojisOpen, open: !emojisOpen.open, anchorEl: event.currentTarget})
  }

  function openOptionsMenu(event){
    setOptionsOpen({...optionsOpen, open: !optionsOpen.open, anchorEl: event.currentTarget})
  }
  async function copyToClipboard(event) {
    console.log(event)
    if ('clipboard' in navigator) {
      return await navigator.clipboard.writeText(event.target.textContent);
    } else {
      return document.execCommand('copy', true, event.target.textContent);
    }
  }
  
  return (
    
    isConnected ? 
     <Box style={{height: '100vh'}}>
      <audio ref={enterAudio} src='https://www.gstatic.com/meet/sounds/join_call_6a6a67d6bcc7a4e373ed40fdeff3930a.ogg'></audio>
      <audio ref={leaveAudio} src='https://www.gstatic.com/meet/sounds/leave_call_bfab46cf473a2e5d474c1b71ccf843a1.ogg'></audio>
    {gridViewSelected === 1 && 
    
     <Grid  container spacing={2} padding={2}>
      
      <Grid item xs={12}  sm={participants.length == 0 ? 12 : 9}>
      <Box style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <VideoLocal 
          handleFullScreen={handleFullScreen}
          localVideo={localVideo}
          videoToogle={videoToogle}
          emojisUser={emojisUser}
          setEmojisUser={setEmojisUser}
          localAudio={localAudio}
          micToogle={micToogle}
          user={user}
          height='100%'
        />
        </Box>

      </Grid>
      <Grid item xs={12}  sm={3}>
        <Stack direction={{ xs: 'row', sm: 'column' }} style={{ maxHeight: '92vh',overflow: 'auto'}} spacing={2}> 
          {participants.length > 0 &&
            participants.map(participant =>  (
              // <div ref={selectedParticipantRef}>
              <div  ref={mainDiv}>

              <Participant 
              fullScreenToogle={fullScreenToogle}
              selectParticipant={selectParticipant}
              style={{cursor: 'pointer'}}
              key={participant.sid}
              participant={participant}
              raiseHand={raiseHand}
              micsOff={micsOff}
              width='250px'
              />
              </div>
              // </div>
              ))
            }
        </Stack>
    </Grid>
    <SideBar room={roomName} setShowBadge={setShowBadge} open={open} setOpen={setOpen} />
   <SidebarParticipants  
    raiseHand={raiseHand} 
    isOwner={room} 
    removeParticipant={removeParticipant} 
    participants={participants} 
    openParticipants={openParticipants} 
    setOpenParticipants={setOpenParticipants} 
    disableMics={disableMics}
    micsOff={micsOff}
    /> 

  </Grid>
  }

  { gridViewSelected === 2 && 
    <Grid container spacing={2} padding={2}>
               <Grid item gap={2} md={3}>
                {/* <div style={{position:'relative', borderRadius: '10px', backgroundColor: "#585858", padding: '4px 4px 0 3px'}} sx={{width: '200px'}}>
                  <video onDoubleClick={handleFullScreen} ref={localVideo} style={{ height:"150px", width: '100%', objectFit: "cover", borderRadius:"10px", position: 'relatve'}} autoPlay={true} />
                  <p style={{position: 'absolute', left: '5px', bottom: '-8px', zIndex:'9'}} >{user.name}</p>
                </div> */}
                <Box style={{position:'relative', borderRadius: '10px', backgroundColor: "#585858", padding: '4px 4px 0 3px'}} sx={{width: '250px'}}>
      
                <VideoLocal 
                  handleFullScreen={handleFullScreen}
                  localVideo={localVideo}
                  videoToogle={videoToogle}
                  emojisUser={emojisUser}
                  setEmojisUser={setEmojisUser}
                  localAudio={localAudio}
                  micToogle={micToogle}
                  user={user}
                  height='100%'
                />
                </Box>
              </Grid>
                
            {participants.length > 0 && 
              participants.map(participant =>  (
                
                <Grid item gap={2} md={3}>
                  <div  ref={mainDiv}>

                <Participant
                  selectParticipant={selectParticipant}
                  style={{cursor: 'pointer'}}
                  key={participant.sid}
                  participant={participant}
                  raiseHand={raiseHand}
                  micsOff={micsOff}
                  />
                  </div>
                
                </Grid>
                  ))
                }
    </Grid>
  }

{room && isConnected && 
    <div  style={{ width:'100%', display: 'flex', justifyContent: 'center', gap: '7px', position: 'relative', margin: '0 auto'}}>
    <Tooltip title="Audio On/Off"><IconButton style={micToogle ? {backgroundColor: 'white'} : {backgroundColor: 'red'}} onClick={handleMic}>{micToogle ? <MicIcon /> : <MicOffIcon />}</IconButton></Tooltip>
    <Tooltip title="Video On/Off"><IconButton style={videoToogle ? {backgroundColor: 'white'} : {backgroundColor: 'red'}} onClick={handleVideo}>{videoToogle ? <VideocamIcon /> : <VideocamOffIcon />}</IconButton></Tooltip>
    <Tooltip title="Disconnect"><IconButton style={{backgroundColor: 'red'}} onClick={handleDisconnect}><PhoneDisabledIcon /></IconButton></Tooltip>
    { sendWait ? 
      <IconButton style={{backgroundColor: 'grey'}}><TagFacesIcon /></IconButton>
    :
      <EmojisMenu 
      emojisOpen={emojisOpen}
      openEmojisMenu={openEmojisMenu}
      setEmojisOpen={setEmojisOpen}
      sendDataToRoom={sendDataToRoom}
      />
    }
    <OptionsMenu
      optionsOpen={optionsOpen}
      openOptionsMenu={openOptionsMenu}
      shareScreen={shareScreen}
      shareToogle={shareToogle}
      handleFullScreen={handleFullScreen}
      fullScreenToogle={fullScreenToogle}
      setModalViews={setModalViews}
      setOptionsOpen={setOptionsOpen}
    />
  </div> }
  <Box style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginInline: '40px'}}>
    <Box style={{display: 'flex', alignItems:'center'}}>
      <Typography>{count} online users in - </Typography>
      <Tooltip title="Copy to Clipboard"><button style={{padding: '1px'}} id="gbutton" variant='outlined' onClick={copyToClipboard}>{roomName}</button></Tooltip>
    </Box>
    <Clock />
    <Box style={{display: 'flex', gap: '7px'}}>
      <Tooltip title="Chat"><IconButton style={{backgroundColor: 'white'}} onClick={showChats}><Badge color="primary" variant="dot" badgeContent=" " invisible={showBadge} ><ChatIcon /></Badge></IconButton></Tooltip>
      <Tooltip title="Participants"><IconButton style={{backgroundColor: 'white'}} onClick={() => setOpenParticipants(true)}>{ <PeopleIcon />}</IconButton></Tooltip>
    </Box>
  </Box>

  {
    roomOwner && newParticipant.length > 0 && newParticipant.reverse().map((participant) => (
      <NewParticipantDialog 
        openModalParticipant={openModalParticipant}
        participant={participant}
        acceptAll={acceptAll}
        rejectParticipant={rejectParticipant}
        acceptParticipant={acceptParticipant}
        newParticipant={newParticipant}
      />
    ))
  }
  <DisconnectModal 
    openModal={openModal}
    setOpenModal={setOpenModal}
    disconnectAll={disconnectAll}
    disconnect={disconnect}
  />
  <ChangeViewModal gridView={gridView} openModal={modalViews} setOpenModal={setModalViews} changeView={changeView} />

  </Box>
    : 
    <Box>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={!isConnected}
      >
        <CircularProgress color="inherit" />
        Loading... Please wait while you are allowed to enter.
        <Button variant='contained' onClick={disconnect}>Exit</Button>
      </Backdrop>
    </Box>
  );


};

export default WaitingRoom