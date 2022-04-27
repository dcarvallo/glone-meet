import {useState, useEffect} from 'react'
import { useAuth0 } from '@auth0/auth0-react';
import GNavbar from './GNavbar';
import Button from '@mui/material/Button';
import Video from 'twilio-video';
const RoomChat = () => {

 
  const {isAuthenticated, isLoading, user} = useAuth0();
  const [count, setCount ] = useState(0);
  const [roomName, setRoomName] = useState('');
  const [track, setTrack] = useState('')
  const [participants2, setParticipants2] = useState([]);

  const MAX_PARTICIPANTS = 4

  useEffect(() => {
    addLocalVideo()
  },[])

  let connected = false
  let room
  const $ = selector => document.querySelector(selector)
  const $container = $('#container')

  async function addLocalVideo () {
    const $localVideo = document.getElementById('local-video')
    let trackLocal = await Video.createLocalVideoTrack()
    setTrack(trackLocal)
    console.log('track: ',trackLocal)
    $localVideo.appendChild(trackLocal.attach())
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
    const username = user.name
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
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({username})
    })
  
    const data = await response.json()
    room = await Video.connect(data.token)
    setParticipants2(room)
    room.participants.forEach(participantConnected)
    room.on('participantConnected', participantConnected)
    room.on('participantDisconnected', participantDisconnected)
    console.log('room: ',room)
    connected = true
    // setParticipants2(room.participants)
    updateParticipantCount()
  }
  
  function disconnect () {
    room.disconnect()
    // quitar la cámara de los divs
    connected = false
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
    setParticipants2(prev => [...prev, participant])
  
    participant.tracks.forEach(localTrackPublication => {
      const {isSubscribed, track} = localTrackPublication
      if (isSubscribed) attachTrack(track)
    })
    console.log('participant:', participant)
    participant.on('trackSubscribed', attachTrack.tracks)
    participant.on('trackUnsubscribed', track => track.detach())
    
    updateParticipantCount()
  }
  
  function attachTrack (track) {
    const $video = $container.querySelector(`.participant:last-child .video`)
    $video.appendChild(track.attach())
  }
  
  function participantDisconnected (participant) {
    console.log('participant disconnected')
  }

  function startVideo() {
    track.restart();
    // endVideoUI();
  }

  function stopVideo() {
    console.log(track)
    track._end();
    track.stop();
    endVideoUI();
  }
  function startAudio() {
    track.stop();
    endVideoUI();
  }
  function stopAudio() {
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
      <h2>Enter a room</h2>

      <div>
        <label htmlFor="room">Create Room </label>
        <input
          type="text"
          id="room"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          required
        />
      </div>
      <Button variant="contained" type="submit">Create</Button>
    </form>
    <div id="container">
    <div id="local" className="participant">
      <div id="local-video"></div>
      <Button onClick={startAudio} variant='contained'>Start audio</Button>
      <Button onClick={stopAudio} variant='contained'>Stop audio</Button>
      <Button onClick={startVideo} variant='contained'>Start video</Button>
      <Button onClick={stopVideo} variant='contained'>Stop video</Button>
      <p>{count} online users</p>
      <div>Yo</div>
    </div>
    <hr />
    <hr />
    <hr />
  {participants2 && JSON.stringify(participants2)}
        
      
    {/* <!-- al resto de participantes --> */}
  </div>
    </div>
  );
};

export default RoomChat