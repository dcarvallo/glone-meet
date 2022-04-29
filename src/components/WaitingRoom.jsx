import {useState, useEffect, useRef} from 'react'
import { useAuth0 } from '@auth0/auth0-react';
import GNavbar from './GNavbar';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Video from 'twilio-video';
import Participant from './Participant';
import ChatComponent from './ChatComponent';

const WaitingRoom = () => {

 
  const {isAuthenticated, isLoading, user} = useAuth0();
  const [count, setCount ] = useState(0);
  const [roomName, setRoomName] = useState('');
  const [connected, setConnected] = useState(false)
  const [participants2, setParticipants2] = useState([]);
  const vid = useRef(null)
  const localVideo = useRef(null)
  const [token, setToken] = useState(null)
  const [videoTracks, setVideoTracks] = useState([]);

  const MAX_PARTICIPANTS = 4

  useEffect(() => {
    addLocalVideo()
    handleSubmit()
  },[])


  let room
  // const $ = selector => document.querySelector(selector)
  // const $container = $('#container2')

  async function addLocalVideo () {
    // const $localVideo = document.getElementById('local-video')
    const track = await Video.createLocalVideoTrack()
    // localVideo.current.appendChild(track.attach())
    track.attach(localVideo.current)
  }

 const createRandomRoom = () => {
  let data = Math.random().toString(36).replace(/[^a-z0-9]+/gi, 'g').substring(1, 10)     
  let tes = data.split('')
  tes.splice(3,0,'-')
  tes.splice(7,0,'-')
  return tes.join(''); 
 }

  const handleSubmit = async (e) => {
    // e.preventDefault();

    if (connected) {
      await disconnect()
      return
    }
    let username = user.name
    if (!username) return alert('Please login first')
  
    try {
      await connect({username})
    } catch (e) {
      console.error(e)
  
      alert('Failed to connect')
    }
  }

  async function connect ({username}) {
    
    const response = await fetch('/get_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({username})
    })
  
    const data = await response.json()
    setToken(data.token)
    room = await Video.connect(data.token)
    room.participants.forEach(participantConnected)
    room.on('participantConnected', participantConnected)
    room.on('participantDisconnected', participantDisconnected)
    updateParticipantCount()
    setConnected(true)
  }
  
  function disconnect () {
    // console.log({room})
    room.disconnect()
    // quitar la cámara de los divs
    setConnected(false)
    updateParticipantCount()
  }
  
  function updateParticipantCount () {
    
    setCount(prev => prev + 1)
  }
  
  function participantConnected (participant) {
  
    participant.tracks.forEach(localTrackPublication => {
      const {isSubscribed, track} = localTrackPublication
      if (isSubscribed) {
        console.log({track})
        attachTrack(track)
      }
    })
  
    participant.on('trackSubscribed', attachTrack)
    participant.on('trackUnsubscribed', track => track.detach())
    updateParticipantCount()
    setParticipants2(pres => [...pres, participant])
  }
  
  function attachTrack (track) {
    // const $video = $container.querySelector(`.participant:last-child .video`)
    // vid.current.appendChild(track.attach())
    // $container.appendChild(track.attach())
  }
  
  function participantDisconnected (participant) {
    console.log('participant disconnected', participant)
  }

  function startVideo(track) {
    track.restart();
    // endVideoUI();
  }

  function stopVideo(track) {
    console.log(track)
    track.stop();
    endVideoUI();
  }
  function startAudio(track) {
    track.stop();
    endVideoUI();
  }
  function stopAudio(track) {
    track.stop();
    endVideoUI();
  }


  function endVideoUI() {
  }

  return (
    <Grid  container spacing={2}>
      <Grid item xs={12} md={9}>
        {/* <Button onClick={handleSubmit} variant='contained' >Join</Button> */}
        <div  style={{ width: "100%"}} id="local" className="participant">
            {/* <video ref={localVideo} autoPlay={true} width="100%" height="240" ></video> */}
            <video ref={localVideo} style={{ width:"100%", objectFit: "cover", borderRadius:"7px"}} autoPlay={true} />
            {/* <div ref={localVideo} id="local-video"></div> */}
            <div>{user.name}</div>
            <Button onClick={startAudio} variant='contained'>Start audio</Button>
            <Button onClick={stopAudio} variant='contained'>Stop audio</Button>
            <Button onClick={startVideo} variant='contained'>Start video</Button>
            <Button onClick={stopVideo} variant='contained'>Stop video</Button>
            <p>{count} online users</p>
          </div>
      </Grid>
      <Grid item xs={12} md={3}>
        <div>
        
          {/* <div ref={vid} id="container2"> */}
            
            {participants2.length > 0 ? 
              participants2.map(participant =>  (
                // <div id={'participant-' + participant.sid } class="participant">
                //   <div class="video"></div>
                //   <div>{participant.identity}</div>
                // </div>
                <Participant 
                  key={participant.sid}
                  participant={participant}
                />
              ))
              : null
            }
          {/* </div> */}
        </div>
    </Grid>
    <Grid item xs={12}>
      {token && <ChatComponent room='textoroom'/> }
    </Grid>
  </Grid>
    
  );
};

export default WaitingRoom