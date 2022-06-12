import {useState, useEffect, useRef} from 'react'
import { useAuth0 } from '@auth0/auth0-react';
import '../emojis.scss'
import {Button,Typography,Tooltip,Badge,Grid,Stack,Box,IconButton,Backdrop, CircularProgress} from '@mui/material';
import {Mic,Chat,Videocam,MicOff, VideocamOff,PhoneDisabled,People,TagFaces} from '@mui/icons-material';

import {createLocalVideoTrack } from 'twilio-video';
import Video from 'twilio-video';
import Participant from './Participant';
import SideBar from './SideBar';
import SidebarParticipants from './SidebarParticipants';
import OptionsMenu from './utils/OptionsMenu';
import EmojisMenu from './utils/EmojisMenu';
import ChangeViewModal from './ChangeViewModal';
import NewParticipantDialog from './NewParticipantDialog';
import DisconnectModal from './DisconnectModal';
import VideoLocal from './VideoLocal';
import {sendDataToRoom, disconnect, removeParticipant,connect,acceptParticipant,shareScreen, disconnectAll} from './utils/twilio-functions'


const grids = [
  {id: 1, src: '//www.gstatic.com/meet/layout_v2_sidebar_8dea1e0cfa750f5b3dc5b666daf8178d.svg', selected: true},
  {id: 2, src: '//www.gstatic.com/meet/layout_v2_tiled_b81dc04cf1f16260f8dc9b727c03a14e.svg', selected: false},
]
const MainRoom = ({ roomOwner, roomName}) => {
  
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
      await connect(
        otro,
  token,
  user,
  roomOwner,
  roomName,
  setToken,
  dataTrack,
  setRaiseHand,
  setEmojisUser,
  setParticipants,
  setIsConnected,
  setVideoTrack,
  localVideo,
  addLocalVideo,
  isConnected,
  enterAudio,
  setRoom,
  Video,
  setMicsOff,
  setMicToogle,
  createLocalVideoTrack,
  micToogle,
  setOpenModalParticipant,
  setNewParticipant
      )
    } catch (e) {
      console.error(e)
      localStorage.removeItem('room')
      localStorage.removeItem('twilio-token')
      alert('Failed, connect a camera')
      room.disconnect();
      window.location.reload()
    }
  }

  function addLocalData() {
    const localDataTrack = new Video.LocalDataTrack();
    otro = localDataTrack
    setDataTrack(localDataTrack);
};
  
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

  function rejectParticipant() {
    removeParticipant(newParticipant[0], roomName, setParticipants)
    setOpenModalParticipant(false)
  }

  function disableMics(){
    dataTrack.send(JSON.stringify({
      disableMics: true,
    }));
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
    JSON.parse(room.localParticipant.identity).roomOwner ? setOpenModal(true) : disconnect(leaveAudio,room)
  }

  function showChats(){
    setOpen(true)
    setShowBadge(true)
  }

  function handleFullScreen(vidref){
    setFullScreenToogle(prev => !prev)
    mainDiv.current = vidref
    fullScreenToogle && document.fullscreenElement ? document.exitFullscreen() : mainDiv.current.requestFullscreen()
    setOptionsOpen({...optionsOpen, open: false})
  }

  async function changeView(id){
    videoTrack.stop()
    setGridViewSelected(id)
    setGridView(prev => prev.map( el => el.id == id ? {...el, selected : true} : {...el, selected : false} ))
        
    const track2 = await createLocalVideoTrack()
    setVideoTrack(track2)
    track2.attach(localVideo.current)
    localVideo.current.style.transform = 'scale(-1, 1)'
  }
  function selectParticipant(vidref){
    handleFullScreen(vidref)
  }

  function openEmojisMenu(event){
    setEmojisOpen({...emojisOpen, open: !emojisOpen.open, anchorEl: event.currentTarget})
  }

  function openOptionsMenu(event){
    setOptionsOpen({...optionsOpen, open: !optionsOpen.open, anchorEl: event.currentTarget})
  }
  async function copyToClipboard(event) {
    if ('clipboard' in navigator) {
      return await navigator.clipboard.writeText(event.target.textContent);
    } else {
      return document.execCommand('copy', true, event.target.textContent);
    }
  }
  
  return (
    <>
    <div  ref={mainDiv}></div>
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
              <div >
              <Participant 
              ref={mainDiv}
              style={{cursor: 'pointer'}}
              key={participant.sid}
              participant={participant}
              raiseHand={raiseHand}
              micsOff={micsOff}
              width='250px'
              />
              </div>
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
    other={[roomName, setParticipants]}
    /> 
  </Grid>
  }
  { gridViewSelected === 2 && 
    <Grid container spacing={2} padding={2}>
               <Grid item gap={2} md={3}>
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
                  
                <Participant
                  // selectParticipant={selectParticipant}
                  style={{cursor: 'pointer'}}
                  key={participant.sid}
                  participant={participant}
                  raiseHand={raiseHand}
                  micsOff={micsOff}
                  />
                  
                </Grid>
                  ))
                }
    </Grid>
  }

{room && isConnected && 
    <div  style={{ width:'100%', display: 'flex', justifyContent: 'center', gap: '7px', position: 'relative', margin: '0 auto'}}>
    <Tooltip title="Audio On/Off"><IconButton style={micToogle ? {backgroundColor: 'white'} : {backgroundColor: 'red'}} onClick={handleMic}>{micToogle ? <Mic /> : <MicOff />}</IconButton></Tooltip>
    <Tooltip title="Video On/Off"><IconButton style={videoToogle ? {backgroundColor: 'white'} : {backgroundColor: 'red'}} onClick={handleVideo}>{videoToogle ? <Videocam /> : <VideocamOff />}</IconButton></Tooltip>
    <Tooltip title="Disconnect"><IconButton style={{backgroundColor: 'red'}} onClick={handleDisconnect}><PhoneDisabled /></IconButton></Tooltip>
    { sendWait ? 
      <IconButton style={{backgroundColor: 'grey'}}><TagFaces /></IconButton>
    :
      <EmojisMenu 
      emojisOpen={emojisOpen}
      openEmojisMenu={openEmojisMenu}
      setEmojisOpen={setEmojisOpen}
      sendDataToRoom={sendDataToRoom}
      other={[sendWait,dataTrack,user,room,setSendWait, setEmojisOpen,emojisOpen]}
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
      other={[Video,user,roomName,enterAudio,room,setOptionsOpen,optionsOpen,setParticipants]}
    />
  </div> }
  <Box style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
    <Box style={{display: 'flex', alignItems:'center', margin: '0 15px 0 15px'}}>
      <Typography>{count} online users in Room - </Typography>
      <Tooltip title="Copy to Clipboard"><button style={{padding: '4px', fontSize: '17px'}} id="gbutton" onClick={copyToClipboard}>{roomName}</button></Tooltip>
    </Box>
    {/* <Clock /> */}
    <Box style={{display: 'flex', gap: '7px', marginRight:'15px'}}>
      <Tooltip title="Chat"><IconButton style={{backgroundColor: 'white'}} onClick={showChats}><Badge color="primary" variant="dot" badgeContent=" " invisible={showBadge} ><Chat /></Badge></IconButton></Tooltip>
      <Tooltip title="Participants"><IconButton style={{backgroundColor: 'white'}} onClick={() => setOpenParticipants(true)}>{ <People />}</IconButton></Tooltip>
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
        other={[enterAudio,Video,dataTrack,setParticipants,setNewParticipant]}
      />
    ))
  }
  <DisconnectModal 
    openModal={openModal}
    setOpenModal={setOpenModal}
    disconnectAll={disconnectAll}
    disconnect={disconnect}
    other={[leaveAudio,room,roomName]}
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
        <Button variant='contained' onClick={() => disconnect(leaveAudio,room)}>Exit</Button>
      </Backdrop>
    </Box>

    </>
  );

  
};

export default MainRoom