import {useState, useEffect} from 'react'
import { useAuth0 } from '@auth0/auth0-react';
import GNavbar from './GNavbar';
import Button from '@mui/material/Button';
import Video from 'twilio-video';
const WaitingRoom = () => {

 
  const {isAuthenticated, isLoading, user} = useAuth0();
  const [count, setCount ] = useState(0);
  const [roomName, setRoomName] = useState('');
  const [connected, setConnected] = useState(false)
  // const [track, setTrack] = useState('')
  const [participants2, setParticipants2] = useState([]);

  const MAX_PARTICIPANTS = 4

  useEffect(() => {
    addLocalVideo()
  },[isAuthenticated])


  useEffect(() => {

  },[participants2])
  // let connected = false
  let room
  const $ = selector => document.querySelector(selector)
  const $container = $('#container')

  async function addLocalVideo () {
    const $localVideo = document.getElementById('local-video')
  const track = await Video.createLocalVideoTrack()
  $localVideo.appendChild(track.attach())
  }

 const createRandomRoom = () => {
  let data = Math.random().toString(36).replace(/[^a-z0-9]+/gi, 'g').substring(1, 10)     

  let tes = data.split('')

  tes.splice(3,0,'-')
  tes.splice(7,0,'-')
  return tes.join(''); 
 }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (connected) {
      disconnect()
      // $joinButton.disabled = false
      // $joinButton.innerText = 'Join the room'
      return
    }
    console.log(user)
    let username = user.name
    if (!username) return alert('Please provide an username')
  
    // $joinButton.disabled = true
    // $joinButton.innerText = 'Connecting...'
  
    try {
      await connect({username})
      // $joinButton.disabled = false
      // $joinButton.innerText = 'Leave the room'
    } catch (e) {
      console.error(e)
  
      alert('Failed to connect')
      // $joinButton.disabled = false
      // $joinButton.innerText = 'Join the room'
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
    room = await Video.connect(data.token)
    room.participants.forEach(participantConnected)
    room.on('participantConnected', participantConnected)
    room.on('participantDisconnected', participantDisconnected)
    setConnected(true)
    updateParticipantCount()
  }
  
  function disconnect () {
    room.disconnect()
  console.log({room})
    // quitar la cámara de los divs
    setConnected(false)
    updateParticipantCount()
  }
  
  function updateParticipantCount () {
    setCount(prev => prev + 1)
  }
  
  function participantConnected (participant) {
    const template = `<div id='participant-${participant.id}' class="participant">
    <div class="video"></div>
    <div>${participant.identity}</div>
  </div>`

  $container.insertAdjacentHTML('beforeend', template)

  participant.tracks.forEach(localTrackPublication => {
    const {isSubscribed, track} = localTrackPublication
    if (isSubscribed) attachTrack(track)
  })

  participant.on('trackSubscribed', attachTrack)
  participant.on('trackUnsubscribed', track => track.detach())
  updateParticipantCount()
  }
  
  function attachTrack (track) {
    const $video = $container.querySelector(`.participant:last-child .video`)
    $video.appendChild(track.attach())
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
    // tryButton.disabled = false;
    // stopButton.disabled = true;
    // container.innerHTML = "";
  }

  return (
    <div>
    <form onSubmit={handleSubmit}>
      <div>
        {/* <label htmlFor="room">Google Meet </label> */}
        <input
          type="text"
          id="room"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          
        />
      </div>
      <Button variant="contained" type="submit">{connected ? 'Disconnect': 'Join'}</Button>
    </form>
    <div id="container">
    <div id="local" className="participant">
      <div id="local-video"></div>
      <Button onClick={startAudio} variant='contained'>Start audio</Button>
      <Button onClick={stopAudio} variant='contained'>Stop audio</Button>
      <Button onClick={startVideo} variant='contained'>Start video</Button>
      <Button onClick={stopVideo} variant='contained'>Stop video</Button>
      <p>{count} online users</p>
      <div>{user.name}</div>
    </div>
    <hr />
    <hr />
    <hr />
  {/* {participants2 && JSON.stringify(participants2)} */}
        
      
    {/* <!-- al resto de participantes --> */}
  </div>
    </div>
  );
};

export default WaitingRoom